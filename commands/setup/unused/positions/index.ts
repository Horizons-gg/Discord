//? Exports

export * as create from './create'
export * as remove from './remove'
export * as edit from './edit'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandSubcommandGroupBuilder()
    .setName('positions')
    .setDescription('Position Related Infrastructure')

    .addSubcommand(Subcommands.create.command)
    .addSubcommand(Subcommands.remove.command)
    .addSubcommand(Subcommands.edit.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

}