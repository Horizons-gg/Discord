//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('leave')
    .setDescription('Take a break from the Team and go on Staff Leave')

    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason for going on Leave')
        .setRequired(true)

        .setMinLength(5)
        .setMaxLength(1000)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    

}