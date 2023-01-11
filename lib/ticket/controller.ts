//? Dependencies

import Discord from 'discord.js'

import * as Colors from '@lib/discord/colors'



//? Methods

export function AutocompleteService(service: string): string {

    const lService = service.toLowerCase()

    if (lService.includes('discord')) return '💎 Discord'
    else if (lService.includes('space engineers')) return '🚀 Space Engineers'
    else if (lService.includes('dayz')) return '🧟 DayZ'
    else if (lService.includes('minecraft')) return '⚒️ Minecraft'
    else if (lService.includes('rust')) return '🏹 Rust'
    else if (lService.includes('arma')) return '🔫 ArmA'
    else if (lService.includes('squad')) return '🪖 Squad'
    else if (lService.includes('eco')) return '🌏 Eco'

    else return `⚙️ ${service}`

}



//? Displays

export const OpenedTicket = (Ticket: Ticket, User: Discord.GuildMember): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('🔓 Ticket Opened')
                .setAuthor({ name: `${AutocompleteService(Ticket.details.service)} - Support` })
                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                .setColor(Colors.success)

                .setFields([
                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)}\``, inline: true },
                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                    { name: 'Ticket Number', value: `\`#00000\``, inline: true },
                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                    { name: 'Ticket Priority', value: `\`N/A\``, inline: true },

                    { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true }
                ])

                .setThumbnail(User.user.avatarURL())
        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents([
                    new Discord.ButtonBuilder()
                        .setCustomId('ticket.close')
                        .setLabel('Close Ticket')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setEmoji('🔒')
                ])
        ]
    }
}


export const ClosedTicket = (Ticket: Ticket, User: Discord.GuildMember): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('🔒 Ticket Closed')
                .setAuthor({ name: `${AutocompleteService(Ticket.details.service)} - Support` })
                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                .setColor(Colors.danger)

                .setFields([
                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)}\``, inline: true },
                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                    { name: 'Ticket Number', value: `\`#00000\``, inline: true },
                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                    { name: 'Ticket Priority', value: `\`N/A\``, inline: true },

                    { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true },
                    { name: 'Closed', value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`, inline: true }
                ])

                .setThumbnail(User.user.avatarURL())
        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents([
                    new Discord.ButtonBuilder()
                        .setCustomId('ticket.open')
                        .setLabel('Open Ticket')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setEmoji('🔓'),

                    new Discord.ButtonBuilder()
                        .setCustomId('ticket.archive')
                        .setLabel('Archive Ticket')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setEmoji('📂'),

                    new Discord.ButtonBuilder()
                        .setCustomId('ticket.delete')
                        .setLabel('Delete Ticket')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setEmoji('🗑️')
                ])
        ]
    }
}