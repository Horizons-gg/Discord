//? Exports

export * as add from './add'
export * as remove from './remove'




//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandSubcommandGroupBuilder()
    .setName('user')
    .setDescription('Add or Remove Extra Users from the Current Ticket')

    .addSubcommand(Subcommands.add.command)
    .addSubcommand(Subcommands.remove.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}