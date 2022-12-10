//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('return')
    .setDescription('Return from Staff Leave')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    

}