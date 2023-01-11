//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a User from the Current Ticket')

    .addUserOption(option => option.setName('user').setDescription('User to remove').setRequired(true))



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Tickets = await Collection('tickets')

    const Ticket = await Tickets.findOne({ channel: interaction.channel?.id }) as Ticket
    if (!Ticket) return Messages.responseError('Failed to Remove User from Ticket', interaction, 'No Ticket Found')


    const User = interaction.options.getUser('user', true)

    if (User.bot) return Messages.responseError('Bots cannot be removed from tickets', interaction, 'Failed to Remove User from Ticket')
    if (User.id == Ticket.owner) return Messages.responseError('The ticket owner cannot be removed from the ticket', interaction, 'Failed to Remove User from Ticket')


    const Channel = interaction.channel as Discord.TextChannel
    Channel.permissionOverwrites.delete(User.id)
        .then(() => Messages.responseStandard(`${User} has been removed from the ticket!`, interaction, 'User Removed from Ticket'))

}