import Config from "@lib/config"
import { TicketsConfig } from "@lib/tickets"

import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { Ticket as Tickets } from "@interfaces/ticket"

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor } from "discord.js"


const Options = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('ticket-open')
            .setLabel('🔓 Open Ticket')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('ticket-archive')
            .setLabel('📂 Archive Ticket')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('ticket-delete')
            .setLabel('🛡️ Delete Ticket')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)
    )



export async function main(interaction) {

    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const Guild = Client.guilds.cache.get(Config.discord.guild)

    if (!Ticket.owner) return Ticket.cancel(interaction)
    const User = Guild.members.cache.get(Ticket.owner) || await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return Ticket.cancel(interaction)


    //? Update Access
    Guild.roles.cache.find(role => {
        if (role.name !== "Receiving Support") return
        User.roles.remove(role)
    })


    //? Update Channel
    interaction.channel.edit({ parent: process.env.ticket.closed, lockPermissions: false })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: "🔒 Ticket Closed",
            color: '#f35252',
            author: {
                name: `${Raw[Ticket.designation][0]} - Support`
            },
            fields: [
                { name: 'Ticker Owner', value: `<@${User.id}>`, inline: true },
                { name: 'Designation', value: `\`${Raw[Ticket.designation][0]}\``, inline: true },
                { name: 'Region', value: `\`${Ticket.region}\``, inline: true },
                { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true },
                { name: 'Closed', value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`, inline: true }
            ],
            thumbnail: {
                url: User.user.avatarURL()
            }
        }],
        components: [Options]
    })


    //? Update Ticket
    await Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'closed', closed: new Date() } })


    //? Send Notification
    interaction.channel.send({ embeds: [{ description: `🔒 Ticket has been closed by <@${interaction.user.id}>` }] })

}