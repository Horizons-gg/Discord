//? Dependencies

import Discord from 'discord.js'

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'

import * as Colors from '@lib/discord/colors'

import { AutocompleteService, OpenedTicket } from './controller'



//? Method

export default function (owner: string, details: Ticket['details']): Promise<Discord.TextChannel> {
    return new Promise(async (resolve, reject) => {

        const Tickets = await Collection('tickets')

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        if (!Setup.sections?.opened) return reject('Support System has not been setup correctly, please contact an Administrator.')


        //! Check Users Open Tickets
        const OpenTickets: number = (await Tickets.find({ owner: owner, state: 'open' }).toArray()).length
        if (OpenTickets >= 5) return reject('You have too many open tickets, please close some existing tickets before opening any new ones.')


        const Guild = await GetGuild()
        const User = await GetUser(owner)


        let ChannelName: [string, number] = [`${AutocompleteService(details.service)[1]}-${((User.nickname || User.displayName || User.user.username).replace(/[^a-zA-Z0-9]/g, '')).toLocaleLowerCase() || 'unknown'}`, 0]

        while (Guild.channels.cache.find(channel => channel.name == (ChannelName[1] > 0 ? `${ChannelName[0]}-${ChannelName[1].toString().padStart(2, '0')}` : ChannelName[0]))) {
            ChannelName[1]++
        }

        Guild.channels.create({
            name: ChannelName[1] > 0 ? `${ChannelName[0]}-${ChannelName[1].toString().padStart(2, '0')}` : ChannelName[0],
            parent: Setup.sections.opened
        })
            .then(async channel => {

                const Controller = await channel.send({ embeds: [new Discord.EmbedBuilder().setDescription('> Preparing Ticket Controller, Please Standby...').setColor(Colors.info)] }).then(msg => msg.pin())

                const LastTicketQuery = (await Tickets.find({}, { projection: { number: 1 } }).sort({ _id: -1 }).limit(1).toArray())
                const TicketNumber: number = LastTicketQuery[0] ? LastTicketQuery[0].number + 1 : 1


                const Ticket: Ticket = {
                    _id: new ObjectId(),

                    state: 'open',

                    owner: owner,
                    channel: channel.id,
                    controller: Controller.id,

                    number: TicketNumber,
                    priority: null,
                    ntk: null,
                    conclusion: null,

                    details: details,

                    log: {
                        users: [],
                        messages: []
                    },

                    created: new Date(),
                    closed: null
                }

                channel.permissionOverwrites.create(owner, {
                    ViewChannel: true
                })

                User.roles.add(Setup.receivingSupportRole)


                Tickets.insertOne(Ticket)
                    .then(() => {
                        Controller.edit(OpenedTicket(Ticket, User))
                            .then(() => resolve(channel))
                            .catch(reject)
                    })


                //! Staff On-Duty
                const OnDuty = await Guild.roles.fetch(Setup.onDutyRole)
                if (!OnDuty) return console.error('On-Duty Role does not exist, please update Support Setup!')

                const AvailableStaff = OnDuty.members.filter(member => ['online', 'dnd', 'idle'].includes(member.presence?.status || 'offline'))
                const AvailableArray = AvailableStaff.map(member => `<@${member.id}>`)

                const AvailableDisplay = new Discord.EmbedBuilder()
                    .setAuthor({ name: `🛟 Staff On-Duty  |  ${AvailableArray.length > 0 ? (AvailableArray.length > 1 ? `${AvailableArray.length} Staff Members Available` : '1 Staff Member Available') : 'No Staff Members Available'}` })
                    .setColor(AvailableArray.length > 0 ? (AvailableArray.length > 2 ? Colors.success : Colors.warning) : Colors.danger)
                    .setTimestamp(new Date())


                const States: { online: Discord.GuildMember[], idle: Discord.GuildMember[], dnd: Discord.GuildMember[], invisible: Discord.GuildMember[], offline: Discord.GuildMember[] } = { online: [], idle: [], dnd: [], invisible: [], offline: [] }
                AvailableStaff.forEach(member => States[member.presence?.status || 'offline'].push(member))

                if (AvailableArray.length == 0) AvailableDisplay.setDescription(`>>> There are currently **No** Staff Members Available, Please be Patient and we will get back to you as soon as possible!`)

                if (States.online.length > 0) AvailableDisplay.addFields({ name: `🟩 Online (${States.online.length})`, value: States.online.map(member => `<@${member.id}>`).join('\n'), inline: true },)
                if (States.idle.length > 0) AvailableDisplay.addFields({ name: `🟨 Idle (${States.idle.length})`, value: States.idle.map(member => `<@${member.id}>`).join('\n'), inline: true })
                if (States.dnd.length > 0) AvailableDisplay.addFields({ name: `🟥 DND (${States.dnd.length})`, value: States.dnd.map(member => `<@${member.id}>`).join('\n'), inline: true })

                channel.send({
                    content: `${AutocompleteService(Ticket.details.service)[2] ? `@here ${Guild.roles.cache.find(role => role.name == AutocompleteService(Ticket.details.service)[2]) || `\`Failed to Find Role for: "${AutocompleteService(Ticket.details.service)[2]}" \``}` : '@here'}`,
                    embeds: [AvailableDisplay]
                })


                AvailableStaff.forEach(member => {

                    member.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle('⚠️ Support Ticket Alert ⚠️')
                                .setAuthor({ name: AutocompleteService(Ticket.details.service)[0] })
                                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                                .setColor(Colors.warning)

                                .setFields([
                                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)[0]}\``, inline: true },
                                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                                    { name: 'Ticket Number', value: `\`#${Ticket.number.toString().padStart(5, '0')}\``, inline: true },
                                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                                    { name: 'Ticket Priority', value: `\`${Ticket.priority || 'N/A'}\``, inline: true },

                                    { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true }
                                ])

                                .setThumbnail(User.user.avatarURL())
                        ],

                        components: [
                            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                                .addComponents([
                                    new Discord.ButtonBuilder()
                                        .setLabel('View Ticket')
                                        .setURL(`https://discord.com/channels/${Guild.id}/${Ticket.channel}`)
                                        .setStyle(Discord.ButtonStyle.Link)
                                        .setEmoji('🔗')
                                ])
                        ]
                    })
                        .catch(err => {
                            console.info(`Failed to Alert Staff Member: ${member.user.tag} (${member.id})`)
                            console.error(err)
                            reject(`Failed to Create Channel for Ticket, read console for more information.`)

                            member.roles.remove(Setup.onDutyRole)
                        })

                })


            })
            .catch(err => {
                console.error(err)
                reject(`Failed to Create Channel for Ticket, read console for more information.\n\nError Code: \`${err.code || 'N/A'}\`\nCode: \`${err.message || 'N/A'}\``)
            })


    })
}