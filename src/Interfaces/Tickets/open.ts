import Config from "@lib/config"

import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { Tickets } from "@interfaces/index"

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor, PermissionFlagsBits, TextChannel, SelectMenuBuilder } from "discord.js"



const Raw = Config.ticket.options

const Options = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Tickets-close')
            .setLabel('🔒 Close Ticket')
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId('Tickets-alert')
            .setLabel('🛎️ Alert Staff')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    )



export async function main(interaction, flag, fresh) {

    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const Channel: TextChannel = interaction.channel

    if (!Ticket.owner) return Tickets.cancel(interaction)
    const User = await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return Tickets.cancel(interaction)


    //? Update Access
    await Channel.edit({
        permissionOverwrites:[
            {
                id: User.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            }
        ]
    })

    User.roles.add(Guild.roles.cache.find(role => role.name == 'Receiving Support'))


    //? Update Channel
    await Channel.edit({ parent: Config.ticket.open, lockPermissions: false })


    //? Update Controls
    interaction.update({
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
                    .setCustomId('Tickets-faq')
                    .setPlaceholder('Select a FAQ to speed up the process!')
                    .addOptions(FAQArray)
            )

        interaction.channel.send({ content: Ping.join(' '), components: [List] })

    } else {
        interaction.channel.send(Ping.join(' '))
    }

}