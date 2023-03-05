//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, dbUser } from '@lib/discord'



//? Supported Smart Roles

const SupportedRoles = [
    { role: '🚀Space Engineers', keys: ['Space Engineers'] },
    { role: '🧟DayZ', keys: ['DayZ', 'DZSALauncher'] },
    { role: '☄️Avorion', keys: ['Avorion'] },
    { role: '🔨Minecraft', keys: ['Minecraft'] },
    { role: '🪖Squad', keys: ['Squad'] },
    { role: '🗺️Arma', keys: ['ArmA', 'Arma 2', 'Arma 3', 'Arma: Reforger'] },
    { role: '🎒SCUM', keys: ['Scum'] },
    { role: '🏹Rust', keys: ['Rust'] },
    { role: '🧨Crossfar', keys: ['Crossfar'] },
    { role: '🌌Elite Dangerous', keys: ['Elite Dangerous'] },
]



//? User Cycle

export default async function () {

    const Guild = await GetGuild()

    for (const member of Guild.members.cache.map(m => m)) {

        // Ignore Bots
        if (member.user.bot) continue

        // Fetch User from Database : Create if not found
        const User = await dbUser.Fetch(member.id)


        // Execute Smart Roles for Opt In Users
        if (User.optIn) await SmartRolesAdd(member), await SmartRolesRemove(member, User)


        // Update Users Aliases
        if (!User.aliases.find(alias => alias.tag == member.user.tag)) {
            User.aliases.push({ tag: member.user.tag, date: new Date() })
            if (User.aliases.length > 10) User.aliases.shift()
        }

        // Update Users Activity Log
        if (member.presence?.activities.length) {
            member.presence.activities.forEach(activity => {

                // Ignore Generic Activities
                if (['Custom Status', 'Visual Studio Code', 'Spotify', 'Medal', 'Google Chrome', 'Voice.ai - Voice Changer'].includes(activity.name)) return


                const ActivityIndex = User.activities.findIndex(a => a.name == activity.name)

                if (ActivityIndex == -1) User.activities.push({ name: activity.name, lastSeen: new Date(), logged: [new Date()] })
                else {
                    User.activities[ActivityIndex].lastSeen = new Date()
                    User.activities[ActivityIndex].logged.push(new Date())
                    if (User.activities[ActivityIndex].logged.length > 10) User.activities[ActivityIndex].logged.shift()
                }

            })
        }


        // Update User on Database
        const Users = await Collection('users')
        Users.updateOne({ id: User.id }, { $set: { activities: User.activities, aliases: User.aliases } })

    }

}



//? Functions

function SmartRolesAdd(member: Discord.GuildMember) {

    // Ignore members without a presence or activities
    if (!member.presence) return
    if (!member.presence.activities.length) return


    // Cycle through each activity
    member.presence.activities.forEach(activity => {

        SupportedRoles.forEach(async supportedRole => {

            if (!supportedRole.keys.includes(activity.name)) return

            const Role = member.guild.roles.cache.find(role => role.name === supportedRole.role)

            if (!Role) return
            if (member.roles.cache.has(Role.id)) return

            member.roles.add(Role)
                .then(() => console.info(`Smart Roles: added '${Role.name}' to '${member.user.tag}'`))
                .catch(err => console.error(`Smart Roles: failed to add '${Role.name}' to '${member.user.tag}'`, err))

        })

    })

}


let file = ''


function SmartRolesRemove(member: Discord.GuildMember, data: Member) {

    // Ignore members without a presence or activities
    // if (!member.presence) return
    // if (!member.presence.activities.length) return

    // if (data.activities.length == 0) return

    SupportedRoles.forEach(async supportedRole => {

        const Role = member.guild.roles.cache.find(role => role.name === supportedRole.role)
        if (!Role) return
        if (!member.roles.cache.has(Role.id)) return

        const activity = data.activities.find(a => supportedRole.keys.includes(a.name))
        if (!activity) return console.log(member.user.username, '|', supportedRole.role), file += `${member.user.username} | ${supportedRole.role}\n`

        const LastSeen = new Date(activity.lastSeen)
        const Now = new Date()
        const Difference = (Now.getTime() - LastSeen.getTime())

        if (Difference < 1000 * 60 * 60 * 24 * 7 * 8) return

        console.log(member.user.username, '|', supportedRole.role), file += `${member.user.username} | ${supportedRole.role}\n`

    })

}

import fs from 'fs'
setTimeout(() => {
    console.log('Written Data!')
    fs.writeFileSync('./data.txt', file, 'utf8')
}, 1000 * 60)