import Config from '@lib/config'
import * as Discord from 'discord.js'
import * as Methods from '@lib/ServerMethods'
import { Refresh } from '@lib/commands'
import { app } from '@app/express'
import { Collections } from '@app/mongo'

import * as Events from '../Events'
import * as Commands from '../Commands'
import * as Notifications from '../Notifications'
import * as Interfaces from '@interfaces/index'

export let Client: Discord.Client

export function connect() {

    Client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.GuildBans,
            Discord.GatewayIntentBits.GuildEmojisAndStickers,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.MessageContent,
        ]
    })

    Client.login(Config.discord.token)

    Client.on('ready', () => {
        console.log(`Logged in as ${Client.user.tag}`)

        app.get('/discord', (req, res) => res.send(Client.guilds.cache.get(Config.discord.guild)))

        setInterval(MemberCount, 1000 * 60), MemberCount()
        setInterval(BoostAlert, 1000 * 60 * 60), BoostAlert()

        Collections.Bots.find({ enabled: true }).toArray().then(bots => bots.forEach(bot => EnableBot(bot.id).catch(error => console.log(error))))



        //? Notifications
        Client.on('guildMemberAdd', (member) => Notifications.guildMemberAdd(member))
        Client.on('guildMemberRemove', (member) => Notifications.guildMemberRemove(member))


        //? Interactions
        Client.on('interactionCreate', (interaction: any) => {

            //? Commands
            try {
                if (interaction.type === Discord.InteractionType.ApplicationCommand) Commands.SlashCommands[interaction.commandName](interaction)
            } catch {
                console.log(`Command "${interaction.commandName}" not found`)
                interaction.reply({ content: 'An error occurred while processing your command, this command may no longer be in use or is not yet implemented.', ephemeral: true })
            }


            //? Interfaces
            if (!interaction.customId) return
            const Flag = interaction.customId.split('.') || interaction.customId

            try {
                Interfaces[Flag[0]][Flag[1]](interaction, Flag)
            } catch {
                console.log(`[ERROR] Unknown Interface: ${Flag[0]}.${Flag[1]}`)
                interaction.reply({ content: 'An error occurred while processing your command, this command may no longer be in use or is not yet implemented.', ephemeral: true })
            }

        })


        //? Messages
        Client.on('messageCreate', message => {

            const Channel: any = message.channel


            //? Add Messages to Ticket History
            if ([Config.ticket.open, Config.ticket.closed].includes(Channel.parentId)) Events.MessageCreate.Tickets(message)

        })

    })
}



//? Refresh Slash Commands
Refresh()



//? Member Count
function MemberCount() {
    Client.user.setActivity(`${Client.guilds.cache.get(Config.discord.guild).memberCount} Members`, { type: Discord.ActivityType.Watching })
}

//? Boost Alert
function BoostAlert() {
    if (Config.discord.guild !== '610606066451087370') return

    const Guild: Discord.Guild = Client.guilds.cache.get(Config.discord.guild)
    const Boosts = Guild.premiumSubscriptionCount
    if (Boosts >= 14) return

    const Channel: any = Guild.channels.cache.find(channel => channel.name === '💬staff-chat')
    Channel.send(`${Guild.roles.cache.find(role => role.name === 'Staff')}\n>>> ⚠️ **The Server Requires ${14 - Boosts} Boost/s to retain its Vanity URL (discord.gg/horizons)** ⚠️`)
}



//? Network Bots
export const Bots = {}

export function EnableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (Bots[id]) return reject(`<@${id}> is already running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        if (DBCheck.type === 'game') {
            if (!DBCheck.method) return reject(`<@${id}>'s method is not configured!`), Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })
            if (!DBCheck.host) return reject(`<@${id}>'s host is not configured!`), Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })
        }


        Bots[id] = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] })

        Bots[id].login(DBCheck.token).catch(error => reject(error))

        Bots[id].on('ready', () => {
            console.log(`Network Bot: ${Bots[id].user.tag} has started!`)
            resolve(`<@${id}> has successfully been enabled!`)

            Client.user.setActivity('Preparing Bot...', { type: Discord.ActivityType.Watching })
            Client.user.setStatus('idle')

            if (DBCheck.type === 'game') Methods[DBCheck.method](id, DBCheck.host.split(':'), DBCheck.tag)
            if (DBCheck.type === 'server') Methods.system(id, DBCheck.host, DBCheck.tag)
        })

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: true } })

    })
}

export function DisableBot(id: string) {
    return new Promise(async (resolve, reject) => {

        if (!Bots[id]) return reject(`<@${id}> is not running!`)

        const DBCheck = await Collections.Bots.findOne({ id: id })
        if (!DBCheck) return reject(`<@${id}> is not in the database!`)

        console.log(`Network Bot: ${Bots[id].user.tag} has been stopped!`)

        Bots[id].destroy()
        delete Bots[id]

        Collections.Bots.updateOne({ id: id }, { $set: { enabled: false } })

        resolve(`<@${id}> has successfully been disabled!`)

    })
}