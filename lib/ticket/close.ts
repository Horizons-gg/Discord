//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'

import { ClosedTicket } from './controller'



//? Method

export default function (channel: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        const Tickets = await Collection('tickets')

        const Ticket = await Tickets.findOne({ channel: channel }) as Ticket
        if (!Ticket) return reject('Ticket does not exist.')

        if (Ticket.state === 'closed') return reject('Ticket is already closed!')

        Ticket.state = 'closed'
        Ticket.closed = new Date()


        Tickets.updateOne({ channel: channel }, { $set: Ticket })
            .then(async () => {

                const Guild = await GetGuild()
                const Channel = (Guild.channels.cache.get(channel) || await Guild.channels.fetch(channel)) as Discord.TextChannel

                if (!Channel) return reject('Channel does not exist.')

                const Controller = Channel.messages.cache.get(Ticket.controller) || await Channel.messages.fetch(Ticket.controller)
                Controller.edit(ClosedTicket(Ticket, await GetUser(Ticket.owner)))

                Channel.edit({ parent: Setup.sections?.closed })
                    .then(() => resolve('Ticket has been closed.'))
                    .catch(err => reject('Failed to move channel to closed section.'))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to update ticket in database, read console for more information.')
            })

    })
}