//? Exports

export * as onduty from './onduty'




//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('staff')
    .setDescription('Commands for Staff Members')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8192)

    .addSubcommand(Subcommands.onduty.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

}