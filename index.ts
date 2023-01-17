//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import Client from '@lib/discord'
import SmartRoles from '@lib/discord/smartRoles'

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

    function UpdateMemberCount() {
        client.user?.setPresence({
            status: 'online',
            activities: [{
                type: Discord.ActivityType.Watching,
                name: `${client.guilds.cache.get(Config.discord.guild)?.memberCount} Members`
            }]
        })
    }

    setInterval(UpdateMemberCount, 1000 * 60 * 5), UpdateMemberCount()



    //! Smart Roles

    setInterval(SmartRoles, 1000 * 60 * 15), SmartRoles()

})