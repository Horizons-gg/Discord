//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import * as Ticket from '@lib/ticket'

import * as Messages from '@lib/discord/messages'
import GuildRaw from '@lib/discord/common/guild'
import * as Verification from '@lib/discord/common/verify'



//? Handler

export default async (message: Discord.Message) => {

    const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support

    const Guild = await GuildRaw()
    const Channel = message.channel as Discord.TextChannel


    if (Channel.parentId == Setup.sections.opened || Channel.parentId == Setup.sections.closed) Ticket.log(message)


    if (message.channel.type === Discord.ChannelType.DM && !message.author.bot) {

        const DevSpam = Guild.channels.cache.get('669408058564411393') as Discord.TextBasedChannel
        if (!DevSpam) return Channel.send('An error has occurred whilst trying to retrieve "DevSpam", please contact Koda for assistance.'), console.error('An error has occurred whilst trying to retrieve "DevSpam"')
        

        //! Account Verification
        Verification.attempt(message.author.id, message.content)
            .then(() => {
                message.react('✅').catch(() => { })
                Messages.notifyStandard(`${message.author} has successfully verified their account age!`, DevSpam, `${message.author.username} has Verified their Account Age ✅`, 'success')
            })
            .catch((error: string) => {
                const Data = error.split('-')

                if (Data[0] === 'NO_SESSION') Messages.notifyStandard(`__Account:__ ${message.author} (${message.author.id})\n\`\`\`${message.content}\`\`\``, DevSpam, `DM Received from ${message.author.username} 💬`, 'info')
                if (Data[0] === 'INVALID_KEY') message.react('❌').catch(() => { }), Messages.notifyStandard(`${message.author} has entered the incorrect code to verify their account age!\n\nCode Entered by User: \`${Data[2]}\`\nValidation Code: \`${Data[1]}\``, DevSpam, `${message.author.username} Entered Incorrect Validation Code 💢`, 'warning')
            })
    }

}