//? Dependencies

import Discord from 'discord.js'

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'

import * as Colors from '@lib/discord/colors'

import { OpenedTicket } from './controller'



//? Method

export default function (owner: string, details: Ticket['details']): Promise<Discord.TextChannel> {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        if (!Setup.sections?.opened) return reject('Support System has not been setup correctly, please contact an Administrator.')


        const Guild = await GetGuild()
        const User = await GetUser(owner)

        Guild.channels.create({
            name: `new-${User.user.username.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`,
            parent: Setup.sections.opened
        })
            .then(async channel => {

                const Controller = await channel.send({ embeds: [new Discord.EmbedBuilder().setDescription('> Preparing Ticket Controller, Please Standby...').setColor(Colors.info)] }).then(msg => msg.pin())

                const Ticket: Ticket = {
                    _id: new ObjectId(),

                    state: 'open',

                    owner: owner,
                    channel: channel.id,
                    controller: Controller.id,

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
                })

                const Tickets = await Collection('tickets')
                Tickets.insertOne(Ticket)
                    .then(() => {
                        Controller.edit(OpenedTicket(Ticket, User))
                            .then(() => resolve(channel))
                            .catch(reject)
                    })

            })
            .catch(err => {
                console.error(err)
                reject('Failed to Create Channel for Ticket, read console for more information.')
            })


    })
}