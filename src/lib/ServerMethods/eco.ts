import { Games } from '@api/servers'
import { Bots } from '@app/discord'
import * as Discord from 'discord.js'

let Mode = {}


export function main(id: string, Host: Array<string>, Tag: string) {

    if (!Bots[id]) return
    const Client = Bots[id]

    if (!Mode[id]) Mode[id] = false


    if (!Mode[id]) {
        Mode[id] = true

        fetch(`http://${Host[0]}:${Host[1]}/info`)
            .then(res => res.json())
            .then(body => {
                Games[Tag] = body

                if (body.OnlinePlayers > 0) {
                    Client.user.setActivity(`${body.OnlinePlayers} / ${body.TotalPlayers} Players`, { type: Discord.ActivityType.Watching })
                    Client.user.setStatus('online')
                } else {
                    Client.user.setActivity(`No Players Online`, { type: Discord.ActivityType.Watching })
                    Client.user.setStatus('idle')
                }
            })
            .catch(() => {
                Games[Tag] = null

                Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('dnd')
            })
    } else {
        Mode[id] = false

        fetch(`http://${Host[0]}:${Host[1]}/info`)
            .then(res => res.json())
            .then(body => {

                let age_seconds = body.TimeLeft
                let age_minutes = 0
                let age_hours = 0
                let age_days = 0

                while (age_seconds >= 60) {
                    age_minutes += 1;
                    age_seconds -= 60;
                };

                while (age_minutes >= 60) {
                    age_hours += 1;
                    age_minutes -= 60;
                };

                while (age_hours >= 24) {
                    age_days += 1;
                    age_hours -= 24;
                };

                Client.user.setActivity(`Impact in ${age_days}d, ${age_hours}h`, { type: Discord.ActivityType.Watching })
            })
            .catch(() => {
                Client.user.setActivity(`Server Offline`, { type: Discord.ActivityType.Watching })
                Client.user.setStatus('dnd')
            })
    }

    setTimeout(main.bind(null, id, Host), 1000 * 8)
}