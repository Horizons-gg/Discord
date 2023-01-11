//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Method

export default function (channel: string) {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        const Tickets = await Collection('tickets')

        const Ticket = await Tickets.findOne({ channel: channel }) as Ticket
        if (!Ticket) return reject('Ticket does not exist.')

        if (Ticket.state === 'open') return reject('Ticket is already open!')

        Ticket.state = 'open'
        Ticket.closed = null

        Tickets.updateOne({ channel: channel }, { $set: Ticket })
            .then(async () => {

                const Guild = await GetGuild()
                const Channel = Guild.channels.cache.get(channel) || await Guild.channels.fetch(channel)

                if (!Channel) return reject('Channel does not exist.')

                Channel.edit({ parent: Setup.sections?.opened })
                    .then(() => resolve('Ticket has been opened.'))
                    .catch(err => reject('Failed to move channel to opened section.'))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to update ticket in database, read console for more information.')
            })

    })
}