//? Dependencies

import Discord from 'discord.js'



//? Validate Discord Client

export default function (id: string, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const Client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] })

        Client.login(token).catch(() => reject('Invalid Token!'))

        
        Client.on('ready', () => {
            if (Client.user?.id !== id) return reject('Client ID does not match')
            Client.destroy()
            resolve(true)
        })

        Client.on('error', error => {
            Client.destroy()
            reject(error)
        })

    })
}