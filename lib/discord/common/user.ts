//? Dependencies

import * as Discord from 'discord.js'

import Guild from './guild'



//? Method

export default function (id: string): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {

        Guild().then(async guild => {
            const User = guild.members.cache.get(id) || await guild.members.fetch(id)
            if (User) resolve(User)
            else reject('Failed to Fetch User!')
        }).catch(reject)

    })
}