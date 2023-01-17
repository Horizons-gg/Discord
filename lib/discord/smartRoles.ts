//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Supported Smart Roles

const Supported = [
    { role: '🚀Space Engineers', keys: ['Space Engineers'] },
    { role: '🧟DayZ', keys: ['DayZ', 'DZSALauncher'] },
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

    Guild.members.cache.filter(member => !member.user.bot)
        .forEach(async member => {

            if (!member.presence) return
            if (!member.presence.activities.length) return

            
            member.presence.activities.forEach(activity => {

                Supported.forEach(async supportedRole => {
                    
                    if (!supportedRole.keys.includes(activity.name)) return

                    const Role = Guild.roles.cache.find(role => role.name === supportedRole.role)
                    
                    if (!Role) return
                    if (member.roles.cache.has(Role.id)) return
                    
                    member.roles.add(Role)
                        .then(() => console.info(`Smart Roles: added '${Role.name}' to '${member.user.tag}'`))
                        .catch(err => console.error(`Smart Roles: failed to add '${Role.name}' to '${member.user.tag}'`, err))

                })

            })

        })

}