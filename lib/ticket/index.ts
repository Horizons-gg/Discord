//? Dependencies

import { ObjectId } from 'mongodb'
import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Class Definitions

export default class TicketManager implements Ticket {

    _id: Ticket['_id']

    state: Ticket['state']

    owner: Ticket['owner']
    channel: Ticket['channel']

    details: Ticket['details']

    log: Ticket['log']

    created: Ticket['created']
    closed: Ticket['closed']



    constructor() {

        this._id = new ObjectId()

        this.state = 'open'

        this.owner = undefined
        this.channel = undefined

        this.details = {
            title: undefined,
            service: undefined,
            description: undefined
        }

        this.log = {
            users: [],
            messages: []
        }

        this.created = new Date()
        this.closed = null

    }



    initialize(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
            if (!Setup.sections?.opened) return reject('Support System has not been setup correctly, please contact an Administrator.')

            if (!this.owner) return reject('Ticket has no owner!')


            const Guild = await GetGuild()

            Guild.channels.create({
                name: `new-ticket`,
                parent: Setup.sections.opened
            })
                .then(channel => {
                    this.channel = channel
                    this.save().then(() => resolve('Ticket has been successfully initialized.')).catch(err => { reject(err); if (this.channel) this.channel.delete() })
                })
                .catch(err => {
                    console.error(err)
                    reject('Failed to Create Channel for Ticket, read console for more information.')
                })


        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            if (!this.owner || !this.channel) return reject('Ticket has no owner or channel!')

            const Data = {
                ...this,

                owner: this.owner.id,
                channel: this.channel.id
            }



            const Tickets = await Collection('tickets')

            Tickets.updateOne({ _id: this._id }, { $set: Data }, { upsert: true })
                .then(() => resolve('Ticket has been successfully saved.'))
                .catch(err => {
                    console.error(err)
                    reject('Failed to Save Ticket to the Database, read console for more information.')
                })

        })
    }


}