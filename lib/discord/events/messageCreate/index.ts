//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import * as Ticket from '@lib/ticket'

import * as Verification from '@lib/discord/common/verify'



//? Handler

export default async (message: Discord.Message) => {

    const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support

    const Channel = message.channel as Discord.TextChannel


    if (Channel.parentId == Setup.sections.opened || Channel.parentId == Setup.sections.closed) Ticket.log(message)



    if (message.channel.type === Discord.ChannelType.DM) {
        Verification.attempt(message.author.id, message.content)
            .then(() => message.react('✅').catch(() => { }))
            .catch(error => {
                if (error === 'INVALID_KEY') return message.react('❌').catch(() => { })
            })
    }


}