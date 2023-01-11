//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete the Current Ticket')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    if (interaction.channel && interaction.user) Ticket.delete(interaction.channel.id, interaction.user.id)
        .then(res => Messages.responseStandard(res, interaction, 'Ticket Deleted'))
        .catch(err => Messages.responseError(err, interaction, 'Failed to Delete Ticket'))

}