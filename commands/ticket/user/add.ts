//? Dependencies

import Discord from 'discord.js'

import { Messages, User } from '@lib/discord'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a User to the Current Ticket')

    .addUserOption(option => option.setName('user').setDescription('User to add').setRequired(true))



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Tickets = await Collection('tickets')

    const Ticket = await Tickets.findOne({ channel: interaction.channel?.id })
    if (!Ticket) return Messages.responseError('Failed to Add User to Ticket', interaction, 'No Ticket Found')


    const User = interaction.options.getUser('user', true)

    if (User.bot) return Messages.responseError('Bots cannot be added to tickets', interaction, 'Failed to Add User to Ticket')
    if (User.id == Ticket.owner) return Messages.responseError('The ticket owner already has access to this ticket', interaction, 'Failed to Add User to Ticket')


    const Channel = interaction.channel as Discord.TextChannel
    Channel.permissionOverwrites.create(User.id, { ViewChannel: true })
        .then(() => Messages.responseStandard(`${User} has been added to the ticket!`, interaction, 'User Added to Ticket'))

}