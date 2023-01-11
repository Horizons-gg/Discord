//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import * as Ticket from '@lib/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('close')
    .setDescription('Close the Current Ticket')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    if (interaction.channel) Ticket.close(interaction.channel.id)
        .then(res => interaction.reply({ content: `${res}`, ephemeral: true }))
        .catch(err => interaction.reply({ content: `Error: \`${err}\``, ephemeral: true }))

}