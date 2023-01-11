//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import * as Ticket from '@lib/ticket'



//? Handler

export default async (message: Discord.Message) => {

    const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support

    const Channel = message.channel as Discord.TextChannel


    if (Channel.parentId == Setup.sections.opened || Channel.parentId == Setup.sections.closed) Ticket.log(message)


}