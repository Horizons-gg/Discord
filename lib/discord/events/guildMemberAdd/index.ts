//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Colors from '@lib/discord/colors'

import * as Verification from '@lib/discord/common/verify'



//? Handler

export default async (member: Discord.GuildMember) => {

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




    //! Verify Members Account Age

    const AccountAge = (new Date().valueOf() - member.user.createdAt.valueOf()) / 1000 / 60 / 60 / 24

    if (AccountAge < 12) {

        const Key = await Verification.initialize(member).catch(error => {
            console.log(error)
            return null
        })

        if (!Key) return

        member.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('Anti-Bot Detection System - Verification Required')
                    .setDescription(`We have detected that your account is less than a week old, for security purposes we require you to verify your account.\n\nPlease reply with the following code to verify your account: \`${Key}\`\n\n*Please Note that if you do not verify within 15 minutes, your account will be removed!*\n\nIf you have any issues please contact a staff member immediately.`)
                    .setColor(Colors.warning)
            ]
        }).catch(() => {
            GeneralChannel.send({
                content: `${member}`,
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('Anti-Bot Detection System - Verification Required')
                        .setDescription(`Please DM <@${Config.discord.client}> the following code to verify your account: \`${Key}\`\n\n*Please Note that you may need to "Allow direct messages from server members."*\nhttps://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-`)
                        .setColor(Colors.warning)
                ]
            }).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 1000 * 60 * 10))
        })

    }

}