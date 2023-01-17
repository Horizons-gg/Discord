//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('archive')
    .setDescription('Archive the Current Ticket')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    if (interaction.channel && interaction.user) Ticket.archive(interaction.channel.id, interaction.user.id)
        .catch(err => Messages.responseError(err, interaction, 'Failed to Archive Ticket'))

}