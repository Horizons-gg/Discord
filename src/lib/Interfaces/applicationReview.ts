import Config from '@lib/config'
import { Client } from '@app/discord'
import { Application } from '@models/application'
import * as Discord from 'discord.js'



export function Pending(Application: Application, User: Discord.GuildMember, UID: string) {

    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const Management = Guild.roles.cache.find(role => role.name === 'Management').id


    const Row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('application.accept')
                .setLabel('Accept Application')
                .setStyle(Discord.ButtonStyle.Success),

            new Discord.ButtonBuilder()
                .setCustomId('application.deny')
                .setLabel('Deny Application')
                .setStyle(Discord.ButtonStyle.Danger)
        )


    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${User.user.tag}'s Staff Application`)
        .setAuthor({ name: 'Pending Review' })
        .setDescription(`<@${User.id}>`)
        .setThumbnail(User.user.displayAvatarURL({ size: 512, extension: 'jpg' }))
        .setColor('#ff26ac')
        .setFields([
            { name: 'Preferred Name', value: `\`${Application.name}\`` },
            { name: 'Position', value: `\`${Application.position}\``, inline: true },
            { name: 'Region', value: `\`${Application.region}\``, inline: true },
            { name: 'Experience', value: Application.experience },
            { name: 'Statement', value: Application.statement }
        ])
        .setFooter({ text: `Application UID: ${UID}` })
        .setTimestamp(Application.created)


    return { content: `<@&${Management}>`, embeds: [Embed], components: [Row] }

}



export function Accepted(Application, User: Discord.GuildMember, UID: string, Reviewer: Discord.GuildMember) {

    const Row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('application.accept')
                .setLabel('Accept Application')
                .setStyle(Discord.ButtonStyle.Success),

            new Discord.ButtonBuilder()
                .setCustomId('application.deny')
                .setLabel('Deny Application')
                .setStyle(Discord.ButtonStyle.Danger)
        )


    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${User.user.tag}'s Staff Application`)
        .setAuthor({ name: `Accepted by ${Reviewer.user.tag}` })
        .setDescription(`<@${User.id}>`)
        .setThumbnail(User.user.displayAvatarURL({ size: 512, extension: 'jpg' }))
        .setColor('Green')
        .setFields([
            { name: 'Preferred Name', value: `\`${Application.name}\`` },
            { name: 'Position', value: `\`${Application.position}\``, inline: true },
            { name: 'Region', value: `\`${Application.region}\``, inline: true },
            { name: 'Experience', value: Application.experience },
            { name: 'Statement', value: Application.statement }
        ])
        .setFooter({ text: `Application UID: ${UID}` })
        .setTimestamp(Application.created)


    return { embeds: [Embed], components: [] }

}



export function Denied(Application, User: Discord.GuildMember, UID: string, Reviewer: Discord.GuildMember) {

    const Row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('application.accept')
                .setLabel('Accept Application')
                .setStyle(Discord.ButtonStyle.Success),

            new Discord.ButtonBuilder()
                .setCustomId('application.deny')
                .setLabel('Deny Application')
                .setStyle(Discord.ButtonStyle.Danger)
        )


    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${User.user.tag}'s Staff Application`)
        .setAuthor({ name: `Denied by ${Reviewer.user.tag}` })
        .setDescription(`<@${User.id}>`)
        .setThumbnail(User.user.displayAvatarURL({ size: 512, extension: 'jpg' }))
        .setColor('Red')
        .setFields([
            { name: 'Preferred Name', value: `\`${Application.name}\`` },
            { name: 'Position', value: `\`${Application.position}\``, inline: true },
            { name: 'Region', value: `\`${Application.region}\``, inline: true },
            { name: 'Experience', value: Application.experience },
            { name: 'Statement', value: Application.statement }
        ])
        .setFooter({ text: `Application UID: ${UID}` })
        .setTimestamp(Application.created)


    return { embeds: [Embed], components: [] }

}