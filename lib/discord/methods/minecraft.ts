//? Dependencies

import Gamedig from 'gamedig'
import Discord from 'discord.js'



//? Method

export default function main(Client: Discord.Client, Host: [string, number], Tag: string) {

    if (!Client?.isReady()) return


    Gamedig.query({
        type: 'minecraft',
        host: Host[0],
        port: Host[1]
    }).then((state: any) => {
        //! Games[Tag] = state

        if (state.raw.vanilla.raw.players.online === 0) Client.user.setActivity('No Players Online', { type: Discord.ActivityType.Watching }), Client.user.setStatus('idle')
        else Client.user.setActivity(`${state.raw.vanilla.raw.players.online} / ${state.raw.vanilla.raw.players.max} Players`, { type: Discord.ActivityType.Watching }), Client.user.setStatus('online')
    }).catch(error => {
        //! Games[Tag] = null

        Client.user.setActivity({ name: 'Server Offline', type: Discord.ActivityType.Watching })
        Client.user.setStatus('dnd')
    }
    )

    setTimeout(main.bind(null, Client, Host, Tag), 1000 * 10)
}