import Discord from 'discord.js'
import { Bot } from '../index.ts'

const Gamedig = (await import('npm:gamedig')).GameDig



export default function initialize(bot: Bot) {

    async function fetchData() {
        const res = await fetch(`https://www.battlemetrics.com/servers/scum/34156170`)
        const body = await res.text()
        if (!body) return null
        const players = body.split('<dt>Player count</dt>')[1].split('<dd>')[1].split('</dd>')[0]
        const onlinePlayers = players.split('/')[0]
        const maxPlayers = players.split('/')[1]
        if (!onlinePlayers || !maxPlayers) return null
        return {
            players: parseInt(onlinePlayers.trim()),
            maxplayers: parseInt(maxPlayers.trim())
        }
    }

    async function updatePresence(data: { players: number; maxplayers: number } | null) {
        const content = (): [string, Discord.ActivityType, Discord.PresenceStatusData] => {
            if (!data) return ['Failed to query', Discord.ActivityType.Watching, 'dnd']
            if (data.players === 0) return ['No Players Online', Discord.ActivityType.Watching, 'idle']
            else return [`${data.players} / ${data.maxplayers} Players`, Discord.ActivityType.Watching, 'online']
        }

        const presence = content()
        await bot.client.user?.setActivity(presence[0], { type: presence[1] })
    }


    bot.client.user?.setActivity('Initializing...', { type: Discord.ActivityType.Watching })
    bot.client.user?.setStatus('idle')

    setInterval(async () => {
        const data = await fetchData()
        updatePresence(data)
    }, 1000 * 60 * 10)

    fetchData().then(updatePresence)
}