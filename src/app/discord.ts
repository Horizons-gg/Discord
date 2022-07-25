import Config from '@lib/config'
import * as Discord from 'discord.js'

export let Client: Discord.Client

export function connect() {

    let All = []
    for (const intent in Discord.Intents.FLAGS) All.push(Discord.Intents.FLAGS[intent])

    Client = new Discord.Client({ intents: All })

    Client.login(Config.discord.token)

    Client.on('ready', () => console.log(`Logged in as ${Client.user.tag}`))
}