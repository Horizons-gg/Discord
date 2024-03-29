//? Exports

export * as support from './support'



//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('setup')
    .setDescription('Commands for Administrators to use to Setup the Discord Backend Infrastructure')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)

    .addSubcommandGroup(Subcommands.support.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
}