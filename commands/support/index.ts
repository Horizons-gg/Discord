//? Exports

export * as ticket from './ticket'
export * as panel from './panel'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('support')
    .setDescription('Commands to Seek Support in Horizons')
    .setDMPermission(false)

    .addSubcommand(Subcommands.ticket.command)
    .addSubcommand(Subcommands.panel.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}