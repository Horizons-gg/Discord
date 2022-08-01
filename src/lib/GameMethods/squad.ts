import { Bots } from '@app/discord'
import * as Gamedig from 'gamedig'
import * as Discord from 'discord.js'

let Mode = {}


export async function main(id: string, Host: Array<string>) {

    if (!Bots[id]) return
    const Client = Bots[id]

    if (!Mode[id]) Mode[id] = 0


    if (Mode[id] === 0) {
        Mode[id] = 1

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state) => {
            if (state.raw.numplayers > 0) {
                Client.user.setActivity(`${state.raw.numplayers} / ${state.maxplayers} Players`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('online')
            }
            else {
                Client.user.setActivity(`No Players Online`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('idle')
            }
        }).catch(() => {
            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
            Client.user.setStatus('dnd')
        });
        return setTimeout(main.bind(null, id, Host), 1000 * 8)
    }

    if (Mode[id] === 1) {
        Mode[id] = 2

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state) => {
            if (!state.map.includes('Jensens')) Client.user.setActivity(`${state.map.split('_').join(' ')}`, { type: Discord.ActivityType.Competing })
            else Client.user.setActivity(`Jensens Range`, { type: Discord.ActivityType.Competing })
        }).catch(() => {
            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
        });
        return setTimeout(main.bind(null, id, Host), 1000 * 5)
    }

    if (Mode[id] === 2) {
        Mode[id] = 0

        await Gamedig.query({
            type: 'squad',
            host: Host[0],
            port: Host[1],
            maxAttempts: 3,
            socketTimeout: 3000
        }).then((state) => {
            if (!state.map.includes('Jensens')) Client.user.setActivity(`${state.raw.rules.TeamOne_s.split('_').at(-1)} vs ${state.raw.rules.TeamTwo_s.split('_').at(-1)}`, { type: Discord.ActivityType.Watching })
            else Client.user.setActivity(`${state.map.split('_')[1].split('-').join(' vs ')}`, { type: Discord.ActivityType.Watching })
        }).catch(() => {
            Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
        });
        return setTimeout(main.bind(null, id, Host), 1000 * 5)
    }

}