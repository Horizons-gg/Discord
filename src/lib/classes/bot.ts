//? Dependencies

import { Collection } from '@lib/mongodb'
import { ObjectId } from 'mongodb'

import Discord from 'discord.js'
import { User, Guild } from '@lib/discord'
import ValidateClient from '@lib/discord/validate'



//? Class Definition

export default class BotManager implements Bot {

    _id: ObjectId

    id: string
    token: string | null

    type: Bot['type'] | null
    tag: string | null

    enabled: boolean

    host: string | null
    method: Bot['method'] | null


    constructor(id: string) {
        this._id = new ObjectId()

        this.id = id
        this.token = null

        this.type = null
        this.tag = null

        this.enabled = false

        this.host = null
        this.method = null
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
            const UpdateStatus = await Bots.updateOne({ id: this.id }, { $set: this }).catch(reject)
            if (!UpdateStatus?.acknowledged) reject('Failed to update bot in the database!')
            else resolve(`Bot has been successfully updated!`)

        })
    }


    add(): Promise<string> {
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


    remove(): Promise<string> {
        return new Promise(async (resolve, reject) => {

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



    enable(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            this.enabled = true
            this.update().then(() => resolve('Bot Successfully Enabled')).catch(reject)

        })
    }

    disable(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            this.enabled = false
            this.update().then(() => resolve('Bot Successfully Disabled')).catch(reject)

        })
    }



}