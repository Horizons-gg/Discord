//? Dependencies

import { Collection } from '@lib/mongodb'
import Client from '@lib/discord'

import BotManager from '@lib/classes/bot'



//? Initialize

Client()

Collection('bots')
    .then(async Bots => {
        const BotList = await Bots.find().toArray()
        BotList.forEach(async bot => {
            const Bot = new BotManager(bot.id)
            if (!await Bot.fetch().then(() => Bot.enabled == true).catch(() => false)) return
            Bot.connect().catch(console.error)
        })
    })