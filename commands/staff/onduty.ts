//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import { Messages } from '@lib/discord'
import { User as GetUser } from '@lib/discord'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('onduty')
    .setDescription('Mark yourself as available/unavailable for Support and Moderation')



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support

    const User = await GetUser(interaction.user.id)
    if (!User) return Messages.responseError('Failed to Mark User as On-Duty', interaction, 'User not found')

    if (User.roles.cache.has(Setup.onDutyRole)) User.roles.remove(Setup.onDutyRole).then(() => Messages.responseStandard('You are now marked as **Off-Duty**', interaction, 'User Marked as Off-Duty'))
    else User.roles.add(Setup.onDutyRole).then(() => Messages.responseStandard('You are now marked as **On-Duty**', interaction, 'User Marked as On-Duty'))

}