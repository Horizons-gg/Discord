import Config from "@lib/config"

import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { Tickets } from "@interfaces/index"

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor } from "discord.js"



const Raw = Config.ticket.options

const Options = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Tickets-open')
            .setLabel('🔓 Open Ticket')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('Tickets-archive')
            .setLabel('📂 Archive Ticket')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('Tickets-delete')
            .setLabel('🛡️ Delete Ticket')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false)
    )



export async function main(interaction) {

    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const Guild = Client.guilds.cache.get(Config.discord.guild)

    if (!Ticket.owner) return Tickets.cancel(interaction)
    const User = Guild.members.cache.get(Ticket.owner) || await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return Tickets.cancel(interaction)


    //? Update Access
    User.roles.remove(Guild.roles.cache.find(role => role.name == 'Receiving Support'))


    //? Update Channel
    interaction.channel.edit({ parent: Config.ticket.closed, lockPermissions: false })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: "🔒 Ticket Closed",
            color: resolveColor('#f35252'),
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
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'closed', closed: new Date() } })


    //? Send Notification
    interaction.channel.send({ embeds: [{ description: `🔒 Ticket has been closed by <@${interaction.user.id}>` }] })

}