//? Exports

export * as section from './section'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandSubcommandGroupBuilder()
    .setName('positions')
    .setDescription('Position Related Infrastructure')

    .addSubcommand(Subcommands.section.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}