//? Exports

export * as add from './add'
export * as remove from './remove'

export * as enable from './enable'
export * as disable from './disable'

export * as edit from './edit'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('bot')
    .setDescription('Commands related to extra Horizons Bots such as Game & Dedicated Server Bots')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)

    .addSubcommand(Subcommands.add.command)
    .addSubcommand(Subcommands.remove.command)

    .addSubcommand(Subcommands.enable.command)
    .addSubcommand(Subcommands.disable.command)

    .addSubcommand(Subcommands.edit.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}