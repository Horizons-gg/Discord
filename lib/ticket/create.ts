//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Method

export default function (owner: string, details: Ticket['details']) {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        if (!Setup.sections?.opened) return reject('Support System has not been setup correctly, please contact an Administrator.')


        const Guild = await GetGuild()

        Guild.channels.create({
            name: `new-ticket`,
            parent: Setup.sections.opened
        })
            .then(async channel => {

                const Ticket: Ticket = {
                    _id: new ObjectId(),

                    state: 'open',

                    owner: owner,
                    channel: channel.id,

                    details: details,

                    log: {
                        users: [],
                        messages: []
                    },

                    created: new Date(),
                    closed: null
                }

                channel.permissionOverwrites.create(owner, {
                    ViewChannel: true
                });

                (await Collection('tickets')).insertOne(Ticket)
                    .then(() => resolve(channel))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to Create Channel for Ticket, read console for more information.')
            })


    })
}