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
        if (!User.roles.cache.hasAny(...Setup.permissions.delete)) return reject('You do not have permission to delete tickets.')


        await Tickets.deleteOne({ channel: channel })
            .then(async () => {

                const Guild = await GetGuild()
                const Channel = (Guild.channels.cache.get(channel) || await Guild.channels.fetch(channel)) as Discord.TextChannel

                if (!Channel) return reject('Channel does not exist.')

                Channel.delete(`Ticket deleted by ${User.user.tag} (${User.id})`)
                    .then(() => resolve('Ticket has been deleted.'))
                    .catch(err => reject('Failed to delete ticket channel!'))


                const Owner = await GetUser(Ticket.owner)
                Owner.roles.remove(Setup.receivingSupportRole)
                    .catch(err => console.error(err))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to delete ticket in database, read console for more information.')
            })

    })
}