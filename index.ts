//? Dependencies

import { Collection } from '@lib/mongodb'
import Client from '@lib/discord'

import BotManager from '@lib/bot'



//? Initialize

Client().then(() => {

    Collection('bots')
        .then(async Bots => {
            const BotList = await Bots.find().toArray()
            BotList.forEach(async bot => {
                const Bot = new BotManager(bot.id)
                if (!await Bot.fetch().then(() => Bot.enabled == true).catch(() => false)) return
                Bot.connect().then(() => console.info(`\t+ Connected Bot "${Bot.client?.user?.username}" to the Network`)).catch(console.error)
            })
        })

})