//? Dependencies

import Discord from 'discord.js'

import * as Colors from '@lib/discord/colors'



//? Message Payload

export default (): Discord.MessageCreateOptions & Discord.InteractionReplyOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(`<:support:845624848466182164> **Community Support**`)
                .setDescription(`>>> Need Assistance? The Horizons Staff Team will help you with any issues you may be having.\n\nInterested in joining the Staff Team? Apply here!`)
                .setThumbnail('https://i.imgur.com/MVGVVBr.png')
                .setColor(Colors.success)
        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('ticket.create')
                        .setLabel('Support Ticket')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setEmoji('🎫'),

                    new Discord.ButtonBuilder()
                        .setCustomId('application.create')
                        .setLabel('Staff Application')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setEmoji('📝'),

                    new Discord.ButtonBuilder()
                        .setCustomId('report.create')
                        .setLabel('Report Member')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setEmoji('⚠️')
                )
        ]
    }
}