//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Colors from '@lib/discord/colors'



//? Handler

export default (member: Discord.GuildMember) => {

    if (member.guild.id !== Config.discord.guild) return



    const LandingChannel = member.guild.channels.cache.find(channel => channel.name == "🪂landing-pad") as Discord.TextBasedChannel

    if (LandingChannel) LandingChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(Colors.success)
                .setDescription(`<@${member.id}> (${member.user.username}) joined the server`)
        ]
    })



    const GeneralChannel = member.guild.channels.cache.find(channel => channel.name == "🌐general") as Discord.TextBasedChannel

    if (GeneralChannel) GeneralChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(`${member.user.username} has joined the server!`)
                .setDescription(`**${member.user.username}** just joined the Discord.`)
                .setThumbnail(member.user.avatarURL({ extension: 'jpg', 'size': 512 }))
                .setColor(Colors.random())
        ]
    })
        .then(message => {
            setTimeout(() => { message.delete().catch(() => console.log('Failed to delete welcome message!')) }, 1000 * 60 * 15)
        })

}