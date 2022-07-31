import * as Discord from 'discord.js'


export function ValidateClient(id: string, token: string) {
    return new Promise((resolve, reject) => {

        const Client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] })

        Client.login(token).catch(error => reject('Invalid Token!'))

        Client.on('ready', () => {
            if (Client.user.id !== id) return reject('Client ID does not match')
            Client.destroy()
            resolve('Bot is Valid')
        }
        )

        Client.on('error', error => {
            Client.destroy()
            reject(error)
        }
        )


    })
}