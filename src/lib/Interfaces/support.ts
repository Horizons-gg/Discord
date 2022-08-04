import * as Discord from 'discord.js'


const Row = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId('tickets.create')
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
            .setDisabled(true)
    )


const Embed = new Discord.EmbedBuilder()
    .setTitle(`<:support:845624848466182164> **Community Support**`)
    .setDescription(`>>> Need Assistance? The Horizons Staff Team will help you with any issues you may be having.\n\nInterested in joining the Staff Team? Apply here!`)
    .setThumbnail('https://i.imgur.com/MVGVVBr.png')
    .setColor('#3ba55d')


export default {
    embeds: [Embed],
    components: [Row]
}