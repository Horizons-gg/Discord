import Config from '@lib/config'
import { Client, IntentsBitField } from 'discord.js'
import { Refresh } from '@lib/commands'

export let client: Client

export function connect() {

    client = new Client({ intents: new IntentsBitField(32767) })

    client.login(Config.discord.token)

    client.on('ready', () => console.log(`Logged in as ${client.user.tag}`))
}



//? Refresh Slash Commands
Refresh()