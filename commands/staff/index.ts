//? Exports

export * as leave from './leave'
export * as return from './return'

export * as available from './available'
export * as unavailable from './unavailable'




//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('staff')
    .setDescription('Commands for Staff Members')
    .setDMPermission(false)

    .addSubcommand(Subcommands.leave.command)
    .addSubcommand(Subcommands.return.command)

    .addSubcommand(Subcommands.available.command)
    .addSubcommand(Subcommands.unavailable.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}