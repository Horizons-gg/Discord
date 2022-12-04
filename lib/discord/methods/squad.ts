//? Dependencies

import Gamedig from 'gamedig'
import Discord from 'discord.js'

let Mode: any = {}



//? Method

export default async function main(Client: Discord.Client, Host: [string, number], Tag: string): Promise<any> {

    if (!Client?.isReady()) return

    if (!Mode[Client.user.id]) Mode[Client.user.id] = 0


    if (Mode[Client.user.id] === 0) {
        Mode[Client.user.id] = 1

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state: any) => {
            //! Games[Tag] = state

            if (state.raw.numplayers > 0) {
                Client.user.setActivity(`${state.raw.numplayers} / ${state.maxplayers} Players`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('online')
            }
            else {
                Client.user.setActivity(`No Players Online`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('idle')
            }
        }).catch(() => {
            //! Games[Tag] = null

            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
            Client.user.setStatus('dnd')
        })
        return setTimeout(main.bind(null, Client, Host, Tag), 1000 * 8)
    }

    if (Mode[Client.user.id] === 1) {
        Mode[Client.user.id] = 2

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state: any) => {
            if (!state.map.includes('Jensens')) Client.user.setActivity(`${state.map.split('_').join(' ')}`, { type: Discord.ActivityType.Competing })
            else Client.user.setActivity(`Jensens Range`, { type: Discord.ActivityType.Competing })
        }).catch(() => {
            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
        })
        return setTimeout(main.bind(null, Client, Host, Tag), 1000 * 5)
    }

    if (Mode[Client.user.id] === 2) {
        Mode[Client.user.id] = 0

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state: any) => {
            if (!state.map.includes('Jensens')) Client.user.setActivity(`${state.raw.rules.TeamOne_s.split('_').at(-1)} vs ${state.raw.rules.TeamTwo_s.split('_').at(-1)}`, { type: Discord.ActivityType.Watching })
            else Client.user.setActivity(`${state.map.split('_')[1].split('-').join(' vs ')}`, { type: Discord.ActivityType.Watching })
        }).catch(() => {
            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
        })
        return setTimeout(main.bind(null, Client, Host, Tag), 1000 * 5)
    }

}