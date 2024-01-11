//? Dependencies

import Discord from 'discord.js'



//? Method

export default function main(Client: Discord.Client, Host: [string, number], Tag: string) {

    if (!Client?.isReady()) return


    fetch(`http://${Host[0]}:${Host[1] || 30120}/dynamic.json`)
        .then(res => res.json())
        .then(data => {
            //! Games[Tag] = state

            if (data.clients === 0) Client.user.setActivity('No Players Online', { type: Discord.ActivityType.Watching }), Client.user.setStatus('idle')
            else Client.user.setActivity(`${data.clients} / ${data.sv_maxclients} Players`, { type: Discord.ActivityType.Watching }), Client.user.setStatus('online')
        }).catch(error => {
            //! Games[Tag] = null

            Client.user.setActivity({ name: 'Server Offline', type: Discord.ActivityType.Watching })
            Client.user.setStatus('dnd')
        }
        )

    setTimeout(main.bind(null, Client, Host, Tag), 1000 * 10)
}