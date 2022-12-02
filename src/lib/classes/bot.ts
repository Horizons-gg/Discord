//? Dependencies

import { Collection } from '@lib/mongodb'
import { ObjectId } from 'mongodb'

import Discord from 'discord.js'
import { User, Guild } from '@lib/discord'
import ValidateClient from '@lib/discord/validate'

import * as Methods from '@lib/discord/methods'



//? Class Definition

let Active: BotManager[] = []

export default class BotManager implements Bot {

    _id: ObjectId

    id: string
    token: string | null

    type: Bot['type'] | null
    tag: string | null

    enabled: boolean

    host: string | null
    method: Bot['method'] | null


    client: Discord.Client | null


    constructor(id: string) {
        this._id = new ObjectId()

        this.id = id
        this.token = null

        this.type = null
        this.tag = null

        this.enabled = false

        this.host = null
        this.method = null

        this.client = null
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            //? Fetch Bot from Database
            const Bots = await Collection('bots').catch(reject)
            if (!Bots) return

            const Bot = await Bots.findOne({ id: this.id }).catch(reject)
            if (!Bot) return reject('Bot is not registered!')


            //? Update Class
            const previous = this

            this._id = Bot._id

            this.token = Bot.token || previous.token

            this.type = Bot.type || previous.type
            this.tag = Bot.tag || previous.tag

            this.enabled = Bot.enabled || previous.enabled

            this.host = Bot.host || previous.host
            this.method = Bot.method || previous.method

            resolve('Bot has been successfully fetched!')

        })
    }

    update(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            //? Fetch Bot from Database
            const Bots = await Collection('bots').catch(reject)
            if (!Bots) return

            const Bot = await Bots.findOne({ id: this.id }).catch(reject)
            if (!Bot) return reject('Bot is not registered!')


            //? Update Document
            const Document = this
            Document.client = null
            const UpdateStatus = await Bots.updateOne({ id: this.id }, { $set: this }).catch(reject)
            if (!UpdateStatus?.acknowledged) reject('Failed to update bot in the database!')
            else resolve(`Bot has been successfully updated!`)

        })
    }


    create(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            //? Validate Tag
            if (!this.tag?.match(/[a-zA-Z0-9_-]/)) return reject('Tag can only contain letters, numbers, underscores, and dashes!')


            //? Validate that User is a Bot
            const bot = await User(this.id).catch(reject)
            if (!bot) return
            if (!bot.user.bot) return reject(`<@${this.id}> is not a bot!`)


            //? Validate Client
            if (!this.token) return reject('Token is missing!')
            if (!await ValidateClient(this.id, this.token).catch(reject)) return



            //? Add Bot to Database
            const Bots = await Collection('bots').catch(reject)
            if (!Bots) return

            if (await Bots.findOne({ id: this.id })) return reject('Bot is already registered!')

            const InsertStatus = await Bots.insertOne(this).catch(reject)
            if (!InsertStatus?.acknowledged) return reject('Failed to add bot to the database!')



            //? Add Roles to Bot
            const BotRole = bot.guild.roles.cache.find(role => role.name == 'Bots')
            if (!BotRole) return reject('Failed to fetch the Bots role!')

            const TypeRole = bot.guild.roles.cache.find(role => role.name == (this.type == 'server' ? 'Dedicated Servers' : 'Game Servers'))
            if (!TypeRole) return reject(`Failed to fetch the \`${this.type}\` role!`)

            bot.roles.add([BotRole, TypeRole]).then(() => resolve(`<@${this.id}> has been successfully added as a bot to the network!`)).catch(reject)

        })
    }

    delete(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            
            //? Check if Bot is Running
            const ActiveIndex = Active.findIndex(bot => bot.id == this.id)
            if (ActiveIndex != -1) return reject(`<@${this.id}> is currently active! *Please disable the bot before deleting it!*`)

            //? Remove Bot from Database
            const Bots = await Collection('bots').catch(reject)
            if (!Bots) return

            const DeleteStatus = await Bots.deleteOne({ id: this.id }).catch(reject)
            if (!DeleteStatus?.acknowledged) reject("Failed to remove bot from the database! (This could be because the bot isn't registered)")
            else resolve(`<@${this.id}> has been successfully removed from the network!`)


            //? Remove Roles from Bot
            const bot = await User(this.id).catch(() => { })
            if (!bot) return

            bot.roles.remove(bot.guild.roles.cache.filter(role => ['Bots', 'Game Servers', 'Dedicated Servers'].includes(role.name)))

        })
    }



    connect(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            //? Fetch Bot from Database
            const FetchStatus = await this.fetch().catch(reject)
            if (!FetchStatus) return


            //? Check Bot Setup
            if (!this.enabled) return reject(`<@${this.id}> is not enabled!`)
            if (this.client?.isReady()) return reject(`<@${this.id}> is already connected to Discords API!`)

            if (this.type === 'game') {
                if (!this.method) return reject(`<@${this.id}>'s method is not configured!`), this.disable().catch(() => { })
                if (!this.host) return reject(`<@${this.id}>'s host is not configured!`), this.disable().catch(() => { })
            }


            //? Check Activity
            const ActiveIndex = Active.findIndex(bot => bot.id == this.id)
            if (ActiveIndex != -1) await Active[ActiveIndex].disconnect().then(() => Active.splice(ActiveIndex, 1)).catch(err => console.log(err))


            //? Connect bot to Discord API
            this.client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] })
            this.client.login(this.token || 'UNKNOWN').catch(reject)

            this.client.once('ready', () => {
                this.client?.user?.setActivity('Preparing Bot...', { type: Discord.ActivityType.Watching })
                this.client?.user?.setStatus('idle')


                const host = (this.host || 'horizons.gg:27015').split(':')

                if (!this.client?.isReady()) return reject(`<@${this.id}> failed to connect to Discords API!`)
                
                if (this.type == 'server') Methods.system(this.client, this.host || 'horizons.gg', this.tag || 'UNKNOWN')
                else Methods[this.method || 'valve'](this.client, [host[0], parseInt(host[1])], this.tag || 'UNKNOWN')
                
                Active.push(this)

                resolve(`<@${this.id}> has successfully connected to Discords API!`)
            })

        })
    }

    disconnect(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            //? Check Bot Setup
            if (this.enabled) return reject(`<@${this.id}> is not disabled!`)


            //? Check Activity
            const ActiveIndex = Active.findIndex(bot => bot.id == this.id)
            if (ActiveIndex == -1) return resolve(`<@${this.id}> is already inactive!`)


            //? Disconnect & Kill Connection to Discords API
            Active[ActiveIndex].client?.destroy()
            Active.splice(ActiveIndex, 1)

            resolve(`<@${this.id}> has successfully disconnected from Discords API!`)

        })
    }



    enable(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            this.enabled = true
            this.update().then(() => {
                this.connect().then(resolve).catch(reject)
            }).catch(reject)

        })
    }

    disable(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            this.enabled = false
            this.update().then(() => {
                this.disconnect().then(resolve).catch(reject)
            }).catch(reject)

        })
    }



    setToken(token: string) { this.token = token, this.update().catch(err => console.error(err)) }
    setType(type: Bot['type']) { this.type = type, this.update().catch(err => console.error(err)) }
    setTag(tag: string) { this.tag = tag, this.update().catch(err => console.error(err)) }
    setHost(host: string) { this.host = host, this.update().catch(err => console.error(err)) }
    setMethod(method: Bot['method']) { this.method = method, this.update().catch(err => console.error(err)) }



}