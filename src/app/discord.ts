import Config from '@lib/config'
import { Client as client, GatewayIntentBits } from 'discord.js'
import { Refresh } from '@lib/commands'

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

    Client.on('ready', () => console.log(`Logged in as ${Client.user.tag}`))
}



//? Refresh Slash Commands
Refresh()