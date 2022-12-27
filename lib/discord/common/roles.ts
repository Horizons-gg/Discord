//? Dependencies

import * as Discord from 'discord.js'

import User from './user'
import Guild from './guild'



//! Methods

//? Fetch Role
export async function GetRole(role: string) {

    const guild = await Guild()
    return (guild.roles.cache.get(role) || await guild.roles.fetch(role)) as Discord.Role

}