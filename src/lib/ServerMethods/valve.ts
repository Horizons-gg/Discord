import { Games } from '@api/servers'
import { Bots } from '@app/discord'
import * as Gamedig from 'gamedig'
import * as Discord from 'discord.js'

export function main(id: string, Host: Array<string>, Tag: string) {

    if (!Bots[id]) return
    const Client = Bots[id]


    Gamedig.query({
        type: 'csgo',
        host: Host[0],
        port: Host[1]
    }).then(state => {
        Games[Tag] = state

        if (state.players.length === 0) Client.user.setActivity('No Players Online', { type: Discord.ActivityType.Watching }), Client.user.setStatus('idle')
        else Client.user.setActivity(`${state.players.length} / ${state.maxplayers} Players`, { type: Discord.ActivityType.Watching }), Client.user.setStatus('online')
    }).catch(error => {
        Games[Tag] = null

        Client.user.setActivity({ name: 'Server Offline', type: Discord.ActivityType.Watching })
        Client.user.setStatus('dnd')
    }
    )

    setTimeout(main.bind(null, id, Host), 1000 * 10)
}