//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('close')
    .setDescription('Close the Current Ticket')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    if (interaction.channel) Ticket.close(interaction.channel.id, interaction.user.id)
        .then(() => Messages.noReply(interaction))
        .catch(err => Messages.responseError(err, interaction, 'Failed to Close Ticket'))

}