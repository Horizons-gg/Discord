import Config from "@lib/config"

import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { tickets as Tickets } from "@interfaces/index"

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor, PermissionFlagsBits, TextChannel, SelectMenuBuilder, Message } from "discord.js"



const Raw = Config.ticket.options

const Options: any = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('tickets.close')
            .setLabel('🔒 Close Ticket')
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId('tickets.alert')
            .setLabel('🛎️ Alert Staff')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    )



export async function main(interaction, flag, fresh?, update?) {

    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const Channel: TextChannel = interaction.channel
    const Controls: Message = Channel.messages.cache.get(Ticket.controls) || await Channel.messages.fetch(Ticket.controls)

    if (!Ticket.owner) return Tickets.cancel(interaction)
    const User = await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return Tickets.cancel(interaction)


    //? Update Access
    await Channel.permissionOverwrites.edit(User.id, {
        'SendMessages': true
    })

    User.roles.add(Guild.roles.cache.find(role => role.name == 'Receiving Support'))


    //? Update Channel
    await Channel.edit({ parent: Config.ticket.open, lockPermissions: false })


    //? Update Controls
    Controls.edit({
        embeds: [{
            title: "🔓 Ticket Open",
            color: resolveColor('#54db68'),
            author: {
                name: `${Raw[Ticket.designation][0]} - Support`
            },
            fields: [
                { name: 'Ticker Owner', value: `<@${User.id}>`, inline: true },
                { name: 'Designation', value: `\`${Raw[Ticket.designation][0]}\``, inline: true },
                { name: 'Region', value: `\`${Ticket.region}\``, inline: true },
                { name: 'Ticket Number', value: `\`#${Ticket.number.toString().padStart(5, '0')}\``, inline: true },
                { name: 'Ticket UID', value: `\`${Ticket._id.toString()}\``, inline: true },
                { name: 'Ticket Priority', value: `\`${Ticket.priority || 'N/A'}\``, inline: true },
                { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: false }
            ],
            thumbnail: {
                url: User.user.avatarURL()
            }
        }],
        components: [Options]
    })


    //? Update Ticket
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'open' } })


    //? Notify Staff
    if (update) return
    if (!fresh) return interaction.channel.send({ embeds: [{ description: `🔓 Ticket has been opened by <@${interaction.user.id}>` }] })
    let Ping = []
    Raw[Ticket.designation][2].split(',').forEach(role => {
        Guild.roles.cache.forEach(r => {
            if (r.name === role) {
                Ping.push(`<@&${r.id}>`)
            }
        })
    })

    const FAQ = Config.ticket.options[Ticket.designation][3]

    if (FAQ) {

        //? Create FAQ Controls
        let FAQArray = []
        FAQ.forEach((question, index) => {
            FAQArray.push({
                value: index.toString(),
                label: question.title
            })
        })

        const List = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('tickets.faq')
                    .setPlaceholder('Select a FAQ to speed up the process!')
                    .addOptions(FAQArray)
            )

        interaction.channel.send({ content: Ping.join(' '), components: [List] })

    } else {
        interaction.channel.send(Ping.join(' '))
    }

}