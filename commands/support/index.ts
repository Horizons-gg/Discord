//? Exports

export * as ticket from './ticket'



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



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}