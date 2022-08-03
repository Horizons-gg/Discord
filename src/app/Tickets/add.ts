import { Collections } from "@app/mongo"
import Config from "@lib/config"
import { TextChannel } from "discord.js"

export async function main(interaction) {

    //? Check if channel is a ticket
    if (![Config.ticket.open, Config.ticket.closed].includes(interaction.channel.parentId)) return interaction.reply({ content: 'You can only use this command in a ticket!', ephemeral: true })


    //? Check if User was Mentioned
    if (!interaction.options._hoistedOptions[0]) return interaction.reply({ content: 'Please specify a user to add to the ticket.', ephemeral: true })


    //? Prerequisites
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })
    const User = interaction.options._hoistedOptions[0].member
    const Channel: TextChannel = interaction.channel

    if (Ticket.owner === User.id) return interaction.reply('You cannot add the ticket owner to the ticket.')

    Channel.permissionOverwrites.create(User.id, {
        'ViewChannel': true,
        'SendMessages': true
    })

    interaction.reply({ embeds: [{ "description": `✅ <@${User.id}> has been granted access to this Ticket!` }] })
    User.send({ embeds: [{ "description": `📩 <@${interaction.user.id}> has granted you access to Ticket <#${interaction.channel.id}>` }] }).catch(() => console.log('Failed to send direct message'))

}