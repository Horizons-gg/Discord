//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('available')
    .setDescription('Mark yourself as Available for Support and Moderation')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    

}