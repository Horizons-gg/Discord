//? Exports

export * as open from './open'
export * as close from './close'

export * as archive from './archive'
export * as delete from './delete'




//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Quick Commands for Ticket Management')
    .setDMPermission(false)

    .addSubcommand(Subcommands.open.command)
    .addSubcommand(Subcommands.close.command)

    .addSubcommand(Subcommands.archive.command)
    .addSubcommand(Subcommands.delete.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}