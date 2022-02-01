const { MessageActionRow, MessageButton } = require('discord.js')

const Links = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel('Become a Member!')
            .setStyle('LINK')
            .setURL('https://www.horizons.gg/login'),
        new MessageButton()
            .setLabel('Visit Dashboard')
            .setStyle('LINK')
            .setURL('https://www.horizons.gg/dashboard'),
    )



module.exports = (member) => {

    //? Guild Check
    if (member.guild.id !== process.env.discord.guild) return


    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)


    //? Send Direct Message
    member.send({
        embeds: [{
            color: '#03dbfc',
            title: 'Welcome to Horizons',
            description: `Hey <@${member.id}>, Welcome to the Community!\n\u200b`,
            fields: [
                {
                    name: 'Read our Rules & Info Channel',
                    value: `The <#627864852467286027> Channel contains all the Rules & Information for Horizons.\nAlways check look for information here first.\n\u200b`,
                },
                {
                    name: 'Custom Roles!',
                    value: `You can choose roles that are of interest to you in <#719381556145160232>\n\u200b`,
                }
            ]
        }], components: [Links]
    })


    //? Landing Pad Notification
    Guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({
        embeds: [{
            color: '#1bf531',
            description: `<@${member.id}> (${member.user.tag}) joined the server`
        }]
    })


    //? General Chat Notification
    Guild.channels.cache.find(channel => channel.name === "🌐general").send({
        embeds: [{
            title: `${member.user.username} has joined the server!`,
            description: `**${member.user.tag}** just joined the Discord.`,
            color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
            thumbnail: {
                url: member.user.avatarURL({ dynamic: true })
            }
        }]
    }).then(message => {
        setTimeout(() => { message.delete().catch(() => console.log('Failed to delete welcome message!')) }, 10000)
    })
    
}