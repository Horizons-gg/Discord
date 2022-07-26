import Config from '@lib/config'
import { Client } from '@app/discord'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor } from 'discord.js'

const Links = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Become a Member!')
            .setStyle(ButtonStyle.Link)
            .setURL('https://www.horizons.gg/login'),
        new ButtonBuilder()
            .setLabel('Visit Dashboard')
            .setStyle(ButtonStyle.Link)
            .setURL('https://www.horizons.gg/dashboard'),
    )



export function main(member) {

    //? Guild Check
    if (member.guild.id !== Config.discord.guild) return


    //? Prerequisites
    const Guild: any = Client.guilds.cache.get(Config.discord.guild)


    //? Send Direct Message
    // member.send({
    //     embeds: [{
    //         color: '#03dbfc',
    //         title: 'Welcome to Horizons',
    //         description: `Hey <@${member.id}>, Welcome to the Community!\n\u200b`,
    //         fields: [
    //             {
    //                 name: 'Read our Rules & Info Channel',
    //                 value: `The <#627864852467286027> Channel contains all the Rules & Information for Horizons.\nAlways check look for information here first.\n\u200b`,
    //             },
    //             {
    //                 name: 'Custom Roles!',
    //                 value: `You can choose roles that are of interest to you in <#719381556145160232>\n\u200b`,
    //             }
    //         ]
    //     }], components: [Links]
    // }).catch(() => console.log('Failed to Send Message to User!'))


    //? Landing Pad Notification
    Guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({
        embeds: [{
            color: resolveColor('#1bf531'),
            description: `<@${member.id}> (${member.user.tag}) joined the server`
        }]
    })


    //? General Chat Notification
    Guild.channels.cache.find(channel => channel.name === "🌐general").send({
        embeds: [{
            title: `${member.user.username} has joined the server!`,
            description: `**${member.user.tag}** just joined the Discord.`,
            color: resolveColor(`#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`),
            thumbnail: {
                url: member.user.avatarURL({ dynamic: true })
            }
        }]
    }).then(message => {
        setTimeout(() => { message.delete().catch(() => console.log('Failed to delete welcome message!')) }, 1000 * 60 * 15)
    })

}