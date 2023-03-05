//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    if (!interaction.member) return Messages.responseError('Member Not Found!', interaction, 'Failed to Modify Roles')


    const Name = interaction.customId.split('-')[1]
    const User = interaction.member as Discord.GuildMember

    if (Name == 'games') resolve(User, '🎮Gamer').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))
    if (Name == 'airsoft') resolve(User, '🎯Airsoft').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))

    if (Name == 'se') resolve(User, '🚀Space Engineers').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))
    if (Name == 'dayz') resolve(User, '🧟DayZ').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))
    if (Name == 'avorion') resolve(User, '☄️Avorion').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))
    if (Name == 'squad') resolve(User, '🪖Squad').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))
    if (Name == 'mc') resolve(User, '🔨Minecraft').then(msg => Messages.responseStandard(msg, interaction, 'Roles Modified')).catch(err => Messages.responseError(err, interaction, 'Failed to Modify Roles'))


}



//? Functions

function resolve(user: Discord.GuildMember, role: string): Promise<string> {
    return new Promise((resolve, reject) => {

        const Role = user.guild.roles.cache.find(r => r.name == role)
        if (!Role) return reject(`Role Not Found: \`${role}\``)

        if (user.roles.cache.has(Role.id)) return removeRole(user, Role).then(resolve).catch(reject)
        else return addRole(user, Role).then(resolve).catch(reject)

    })
}

function addRole(user: Discord.GuildMember, role: Discord.Role): Promise<string> {
    return new Promise((resolve, reject) => {

        user.roles.add(role)
            .then(() => resolve(`Successfully Joined Role: ${role}`))
            .catch(err => reject(err))

    })
}

function removeRole(user: Discord.GuildMember, role: Discord.Role): Promise<string> {
    return new Promise((resolve, reject) => {

        user.roles.remove(role)
            .then(() => resolve(`Successfully Left Role: ${role}`))
            .catch(err => reject(err))

    })
}