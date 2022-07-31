import { Bots } from '@app/discord'
import * as Gamedig from 'gamedig'
import * as Discord from 'discord.js'

export function main(id: string, Host: Array<string>) {

    if (!Bots[id]) return
    const Client = Bots[id]


    Gamedig.query({
        type: 'arma3',
        host: Host[0],
        port: Host[1]
    }).then(state => {
        if (state.players.length === 0) Client.user.setActivity('No Players Online', { type: Discord.ActivityType.Watching }), Client.user.setStatus('idle')
        else Client.user.setActivity(`${state.players.length} / ${state.maxplayers} Players`, { type: Discord.ActivityType.Watching }), Client.user.setStatus('online')
    }).catch(error => {
        Client.user.setActivity({ name: 'Server Offline', type: Discord.ActivityType.Watching })
        Client.user.setStatus('dnd')
    }
    )

    setTimeout(main.bind(null, id, Host), 1000 * 10)
}