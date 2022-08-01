import Config from '@lib/config'
import { Client as client, GatewayIntentBits, ActivityType } from 'discord.js'
import { Refresh } from '@lib/commands'
import * as Methods from '@lib/ServerMethods'
import { app } from '@app/express'
import { Collections } from '@app/mongo'

export let Client: client

export function connect() {

    Client = new client({
        intents: [
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent
        ]
    })

    Client.login(Config.discord.token)

    Client.on('ready', () => {
        console.log(`Logged in as ${Client.user.tag}`)

        app.get('/discord', (req, res) => res.send(Client.guilds.cache.get(Config.discord.guild)))

        setInterval(MemberCount, 1000 * 60), MemberCount()

        Collections.Bots.find({ enabled: true }).toArray().then(bots => bots.forEach(bot => EnableBot(bot.id).catch(error => console.log(error))))
    })
}



//? Refresh Slash Commands
Refresh()



//? Member Count
function MemberCount() {
    Client.user.setActivity(`${Client.guilds.cache.get(Config.discord.guild).memberCount} Members`, { type: ActivityType.Watching })
}



//? Network Bots
export const Bots = {}

export function EnableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (Bots[id]) return reject(`<@${id}> is already running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        if (DBCheck.type === 'game') {
            if (!DBCheck.method) return reject(`<@${id}>'s method is not configured!`), Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })
            if (!DBCheck.host) return reject(`<@${id}>'s host is not configured!`), Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })
        }


        Bots[id] = new client({ intents: [GatewayIntentBits.Guilds] })

        Bots[id].login(DBCheck.token).catch(error => reject(error))

        Bots[id].on('ready', () => {
            console.log(`Network Bot: ${Bots[id].user.tag} has started!`)
            resolve(`<@${id}> has successfully been enabled!`)

            Client.user.setActivity('Preparing Bot...', { type: ActivityType.Watching })
            Client.user.setStatus('idle')

            if (DBCheck.type === 'game') Methods[DBCheck.method](id, DBCheck.host.split(':'), DBCheck.tag)
            if (DBCheck.type === 'server') Methods.system(id, DBCheck.host, DBCheck.tag)
        })

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: true } })

    })
}

export function DisableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (!Bots[id]) return reject(`<@${id}> is not running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        console.log(`Network Bot: ${Bots[id].user.tag} has been stopped!`)

        Bots[id].destroy()
        delete Bots[id]

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })

        resolve(`<@${id}> has successfully been disabled!`)

    })
}