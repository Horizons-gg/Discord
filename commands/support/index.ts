//? Exports

export * as panel from './panel'

export * as ticket from './ticket'
export * as application from './application'
export * as report from './report'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('support')
    .setDescription('Commands to Seek Support in Horizons')
    .setDMPermission(false)

    .addSubcommand(Subcommands.panel.command)
    
    .addSubcommand(Subcommands.ticket.command)
    .addSubcommand(Subcommands.application.command)
    .addSubcommand(Subcommands.report.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}