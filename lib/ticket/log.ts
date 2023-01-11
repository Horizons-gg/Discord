//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'

import { ClosedTicket } from './controller'



//? Method

export default async function (message: Discord.Message) {

    if (message.author.bot) return


    const Tickets = await Collection('tickets')

    const Ticket = await Tickets.findOne({ channel: message.channel.id }) as Ticket
    if (!Ticket) return


    if (!Ticket.log.users.find(user => user.id == message.author.id)) Ticket.log.users.push({
        id: message.author.id,
        username: message.author.username,
        discriminator: message.author.discriminator,
        avatar: message.author.avatarURL() || null
    })

    Ticket.log.messages.push({
        id: message.id,
        content: message.content,
        author: message.author.id,
        timestamp: message.createdAt
    })


    Tickets.updateOne({ channel: message.channel.id }, { $set: { log: Ticket.log } })

}