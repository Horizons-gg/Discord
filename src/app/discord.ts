import Config from '@lib/config'
import { Client as client, IntentsBitField } from 'discord.js'
import { Refresh } from '@lib/commands'

export let Client: client

export function connect() {

    Client = new client({ intents: new IntentsBitField(32767) })

    Client.login(Config.discord.token)

    Client.on('ready', () => console.log(`Logged in as ${Client.user.tag}`))
}



//? Refresh Slash Commands
Refresh()