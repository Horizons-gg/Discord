//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import Client from '@lib/discord'
import UserCycle from '@lib/discord/cycle'

import BotManager from '@lib/bot'



//? Initialize

Client().then(client => {

    //! Initialize Bots

    Collection('bots')
        .then(async Bots => {
            const BotList = await Bots.find().toArray()
            BotList.forEach(async bot => {
                const Bot = new BotManager(bot.id)
                if (!await Bot.fetch().then(() => Bot.enabled == true).catch(() => false)) return
                Bot.connect().then(() => console.info(`\t+ Connected Bot "${Bot.client?.user?.username}" to the Network`)).catch(console.error)
            })
        })



    //! Live Member Count

    let StatusSwitch = false
    function UpdateMemberCount() {
        client.user?.setPresence({
            status: 'online',
            activities: [{
                type: Discord.ActivityType.Watching,
                name: StatusSwitch ? `${client.guilds.cache.get(Config.discord.guild)?.memberCount} Members` : `Message me for help!`
            }]
        }), StatusSwitch = !StatusSwitch
    }

    setInterval(UpdateMemberCount, 1000 * 15), UpdateMemberCount()



    //! User Cycle

    setInterval(UserCycle, 1000 * 60 * 15), UserCycle()
    
})