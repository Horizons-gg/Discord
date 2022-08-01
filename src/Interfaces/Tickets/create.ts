import Config from "@lib/config"
import { TicketsConfig as Raw } from "@lib/config"

import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { Tickets } from "@interfaces/index"

import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle, resolveColor, ChannelType, PermissionFlagsBits } from "discord.js"



const Options: any = new ActionRowBuilder()
    .addComponents(
        new SelectMenuBuilder()
            .setCustomId('Tickets-option')
            .setPlaceholder('Please Select a Support Option...')
            .addOptions(Raw)
    )

const Cancel = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Tickets-cancel')
            .setLabel('Cancel Ticket')
            .setStyle(ButtonStyle.Danger)
    )



export async function main(interaction, flag) {

    //? Prerequisites
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)


    //? Validate users age in guild
    if (User.joinedTimestamp + 1200000 > new Date().getTime() && !await User.roles.cache.find(role => role.name === "Member")) return interaction.reply({ content: `You need to be in this discord for at least 20 minutes before you can open tickets, you can open tickets at <t:${Math.floor(User.joinedTimestamp / 1000 + 1200)}:t>`, ephemeral: true })


    //? Check for already open tickets
    if (await Collections.Tickets.findOne({ owner: interaction.user.id, status: 'open' })) return interaction.reply({ content: 'You already have an open ticket!', ephemeral: true })


    //? Prepare Ticket
    let TicketNumber: number
    const Order: any = await Collections.Tickets.find().sort({ number: 1 }).toArray()
    if (Order.length > 0) TicketNumber = Order[Order.length - 1].number + 1
    else TicketNumber = 1


    //? Create Channel
    const Channel = await Guild.channels.create({
        name: `ticket-${User.user.username.replace(/[^a-zA-Z0-9]/g, '')}`,
        reason: `Opened Channel for Ticket #${TicketNumber}`,
        type: ChannelType.GuildText,
        parent: Config.ticket.open,
        permissionOverwrites: [
            {
                id: User.id,
                allow: [PermissionFlagsBits.ViewChannel],
                deny: [PermissionFlagsBits.SendMessages]
            }
        ]
    })


    //? Send Control Panel
    const Controls = await Channel.send({content: "_ _", components: [Options, Cancel] }).then(message => message.pin())


    //? Create Ticket
    await Collections.Tickets.insertOne({
        number: TicketNumber,
        owner: User.id,
        status: 'open',
        channel: Channel.id,
        controls: Controls.id,
        designation: null,
        region: null,
        created: new Date(),
        closed: null,
        users: {},
        history: []
    })


    //? Notify User
    await interaction.reply({ content: `Your ticket has been opened in <#${Channel.id}>, please select an option from the menu to continue.`, ephemeral: true })

}