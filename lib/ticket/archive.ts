//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Method

export default function (channel: string, user: string): Promise<string> {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        const Tickets = await Collection('tickets')

        const Ticket = await Tickets.findOne({ channel: channel }) as Ticket
        if (!Ticket) return reject('Ticket does not exist.')

        const User = await GetUser(user)
        if (!User.roles.cache.hasAny(...Setup.permissions.archive)) return reject('You do not have permission to archive tickets.')

        if (Ticket.state != 'closed') return reject('Ticket must be closed in order to archive it.')


        await Tickets.updateOne({ channel: channel }, { $set: { state: 'archived' } })
            .then(async () => {

                const Guild = await GetGuild()
                const Channel = (Guild.channels.cache.get(channel) || await Guild.channels.fetch(channel)) as Discord.TextChannel

                if (!Channel) return reject('Channel does not exist.')

                Channel.delete(`Ticket Archived by ${User.user.tag} (${User.id})`)
                    .then(() => resolve('Ticket has been archived.'))
                    .catch(err => reject('Failed to archive ticket channel!'))

                    
                const Owner = await GetUser(Ticket.owner)
                Owner.roles.remove(Setup.receivingSupportRole)
                    .catch(err => console.error(err))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to archive ticket in database, read console for more information.')
            })

    })
}