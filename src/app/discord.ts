import Config from '@lib/config'
import { Client as client, GatewayIntentBits, ActivityType } from 'discord.js'
import { Refresh } from '@lib/commands'
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
const Bots = {}

export function EnableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (Bots[id]) return reject(`<@${id}> is already running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        Bots[id] = new client({ intents: [GatewayIntentBits.Guilds] })

        Bots[id].login(DBCheck.token).catch(error => reject(error))

        Bots[id].on('ready', () => {
            console.log(`Network Bot: ${Bots[id].user.tag} has started!`)
            resolve(`<@${id}> has successfully been enabled!`)
        })

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: true } })

    })
}

export function DisableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (!Bots[id]) return reject(`<@${id}> is not already running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        console.log(`Network Bot: ${Bots[id].user.tag} has been stopped!`)

        Bots[id].destroy()
        delete Bots[id]

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })

        resolve(`<@${id}> has successfully been disabled!`)

    })
}