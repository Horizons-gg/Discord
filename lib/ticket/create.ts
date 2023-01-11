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

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        if (!Setup.sections?.opened) return reject('Support System has not been setup correctly, please contact an Administrator.')


        const Guild = await GetGuild()
        const User = await GetUser(owner)

        Guild.channels.create({
            name: `new-${User.user.username.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`,
            parent: Setup.sections.opened
        })
            .then(async channel => {

                const Controller = await channel.send({ embeds: [new Discord.EmbedBuilder().setDescription('> Preparing Ticket Controller, Please Standby...').setColor(Colors.info)] }).then(msg => msg.pin())

                const Ticket: Ticket = {
                    _id: new ObjectId(),

                    state: 'open',

                    owner: owner,
                    channel: channel.id,
                    controller: Controller.id,

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

                const Tickets = await Collection('tickets')
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
                channel.send({
                    content: `@ here`,
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(AvailableArray.length > 0 ? `>>> There is Currently ${AvailableArray.length} Staff Member/s Available!\n\n${AvailableArray.join('\n')}` : `>>> There are Currently No Staff Members Available, Please be Patient and we will get back to you as soon as possible!`)
                            .setColor(AvailableArray.length > 0 ? Colors.primary : Colors.warning)
                    ]
                })

                AvailableStaff.forEach(member => {
                    member.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle('⚠️ Support Ticket Alert ⚠️')
                                .setAuthor({ name: AutocompleteService(Ticket.details.service) })
                                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                                .setColor(Colors.warning)

                                .setFields([
                                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)}\``, inline: true },
                                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                                    { name: 'Ticket Number', value: `\`#00000\``, inline: true },
                                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                                    { name: 'Ticket Priority', value: `\`N/A\``, inline: true },

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


                })


            })
            .catch(err => {
                console.error(err)
                reject('Failed to Create Channel for Ticket, read console for more information.')
            })


    })
}