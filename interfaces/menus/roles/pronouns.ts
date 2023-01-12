//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.StringSelectMenuInteraction) {

    if (!interaction.member) return Messages.responseError('Member Not Found!', interaction, 'Failed to Modify Roles')


    Messages.responseStandard('Your Pronouns have been Updated!', interaction, 'Roles Modified')


    const User = interaction.member as Discord.GuildMember

    if (interaction.values.includes('none')) return User.roles.remove(interaction.guild!.roles.cache.filter(role => ['He/Him', 'She/Her', 'They/Them'].includes(role.name)))

    if (interaction.values.includes('he')) User.roles.add(interaction.guild!.roles.cache.find(role => role.name == 'He/Him') as Discord.Role)
    else User.roles.remove(interaction.guild!.roles.cache.find(role => role.name == 'He/Him') as Discord.Role)

    if (interaction.values.includes('she')) User.roles.add(interaction.guild!.roles.cache.find(role => role.name == 'She/Her') as Discord.Role)
    else User.roles.remove(interaction.guild!.roles.cache.find(role => role.name == 'She/Her') as Discord.Role)

    if (interaction.values.includes('they')) User.roles.add(interaction.guild!.roles.cache.find(role => role.name == 'They/Them') as Discord.Role)
    else User.roles.remove(interaction.guild!.roles.cache.find(role => role.name == 'They/Them') as Discord.Role)


}