//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('unavailable')
    .setDescription('Mark yourself as Unavailable for Support and Moderation')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    

}