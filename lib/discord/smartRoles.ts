//? Dependencies

import Discord from 'discord.js'

import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? User Cycle

export default async function () {

    const Guild = await GetGuild()

    const Users = Guild.members.cache.map(member => member.user.tag)

    console.log(Users)
    console.error(Users.length, Guild.memberCount)

}