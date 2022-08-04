import Config from '@lib/config'
import { Client } from '@app/discord'

export async function Check(User, Roles: [string]) {
    return new Promise(async (resolve, reject) => {

        //? Prerequisites
        const Guild = Client.guilds.cache.get(Config.discord.guild)
        User = Guild.members.cache.get(User) || await Guild.members.fetch(User)

        //? Check Roles
        for (const role of Roles) {
            if (User.roles.cache.some(r => r.name === role)) return resolve(true)
        }

        reject(`${User.user.tag} does not have the required roles!`)

    })
}