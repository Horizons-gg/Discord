import Config from "@lib/config"
import { Check as ValidatePermissions } from "@lib/permissions"
import { open as OpenTicket } from "@interfaces/Tickets"
import { Collections } from "@app/mongo"
import { TextChannel } from "discord.js"

export async function main(interaction) {

    //? Check if channel is a ticket
    if (![Config.ticket.open, Config.ticket.closed].includes(interaction.channel.parentId)) return interaction.reply({ content: 'You can only use this command in a ticket!', ephemeral: true })


    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const User = interaction.user
    const Channel: TextChannel = interaction.channel


    //? Validate Users Permissions
    const Validation = await ValidatePermissions(User.id, ['Staff']).then(() => true).catch(() => false)
    if (!Validation) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true })


    //? Prep Variables
    let Priority = interaction.options._hoistedOptions[0].value
    if (Priority === 'low') Priority = ['Low', '🟢']
    if (Priority === 'med') Priority = ['Medium', '🟡']
    if (Priority === 'high') Priority = ['High', '🔴']


    //? Update Ticket
    Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { priority: Priority[0] } })

    if (Channel.name.startsWith('ticket')) Channel.setName(Priority[1] + Channel.name)
    else Channel.setName(Priority[1] + Channel.name.substring(1, Channel.name.length))

    interaction.reply({ embeds: [{ "description": `${Priority[1]} <@${User.id}> has Updated the Priority of this Ticket to \`${Priority[0]}\`!` }] })

    OpenTicket(interaction, null, null, true)

}