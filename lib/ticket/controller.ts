//? Dependencies

import Discord from 'discord.js'

import * as Colors from '@lib/discord/colors'



//? Methods

export function AutocompleteService(service: string): string[] {

    const lService = service.toLowerCase()

    if (lService.includes('general') || lService.includes('discord')) return ['💎 General', 'general']
    else if (lService.includes('space engineers')) return ['🚀 Space Engineers', 'se', 'SE Staff']
    else if (lService.includes('dayz')) return ['🧟 DayZ', 'dayz', 'DAYZ Staff']
    else if (lService.includes('avorion')) return ['☄️ Avorion', 'avorion']
    else if (lService.includes('minecraft')) return ['⚒️ Minecraft', 'mc', 'MC Staff']
    else if (lService.includes('rust')) return ['🏹 Rust', 'rust', 'RUST Staff']
    else if (lService.includes('arma')) return ['🔫 ArmA', 'arma']
    else if (lService.includes('squad')) return ['🪖 Squad', 'squad', 'SQUAD Staff']
    else if (lService.includes('eco')) return ['🌏 Eco', 'eco', 'ECO Staff']

    else return [`⚙️ ${service}`, 'new']

}



//? Displays

export const OpenedTicket = (Ticket: Ticket, User: Discord.GuildMember): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('🔓 Ticket Opened')
                .setAuthor({ name: `${AutocompleteService(Ticket.details.service)[0]} - Support` })
                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                .setColor(Colors.success)

                .setFields([
                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)[0]}\``, inline: true },
                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                    { name: 'Ticket Number', value: `\`#${Ticket.number.toString().padStart(5, '0')}\``, inline: true },
                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                    { name: 'Ticket Priority', value: `\`${Ticket.priority || 'N/A'}\``, inline: true },

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
                .setAuthor({ name: `${AutocompleteService(Ticket.details.service)[0]} - Support` })
                .setDescription(`\`\`\`${Ticket.details.description}\`\`\``)
                .setColor(Colors.danger)

                .setFields([
                    { name: 'Ticket Owner', value: `<@${Ticket.owner}>`, inline: true },
                    { name: 'Service Designation', value: `\`${AutocompleteService(Ticket.details.service)[0]}\``, inline: true },
                    { name: 'Region', value: `\`${Ticket.details.region}\``, inline: true },

                    { name: 'Ticket Number', value: `\`#${Ticket.number.toString().padStart(5, '0')}\``, inline: true },
                    { name: 'Ticket UID', value: `\`${Ticket._id}\``, inline: true },
                    { name: 'Ticket Priority', value: `\`${Ticket.priority || 'N/A'}\``, inline: true },

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