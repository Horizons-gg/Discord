//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import * as Panels from './panels'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('panel')
    .setDescription('Panel Commands')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)

    .addStringOption(option => option
        .setName('panel')
        .setDescription('Panel to Send')
        .setRequired(true)

        .setChoices(
            { name: 'Role Selection', value: 'role_assignment' },
            { name: 'Smart Roles', value: 'smart_roles' }
        )
    )



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

    if (!interaction.channel) return Messages.responseError('Channel Not Found!', interaction, 'Failed to Create Panel')
    interaction.deferReply()

    const Panel = (Panels as any)[interaction.options.getString('panel', true)]() as Discord.MessageCreateOptions

    interaction.channel.send(Panel)
        .then(() => interaction.deleteReply())
        .catch(err => Messages.responseError(err, interaction, 'Failed to Create Panel').catch(err => console.error(err)))

}