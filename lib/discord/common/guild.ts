//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import Client from '../client'



//? Method

export default function (): Promise<Discord.Guild> {
    return new Promise((resolve, reject) => {

        Client().then(async client => {
            const Guild = client.guilds.cache.get(Config.discord.guild) || await client.guilds.fetch(Config.discord.guild)
            if (Guild) resolve(Guild)
            else reject('Failed to Fetch Guild!')
        }).catch(reject)

    })
}