const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = function () {

    process.client.on('guildMemberAdd', member => {
        if (member.guild.id !== process.env.guild) return

        const embed = {
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
        }

        const links = new MessageActionRow()
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

        member.send({ embeds: [embed], components: [links] });
    });

    process.client.on('guildMemberAdd', member => {
        if (member.guild.id !== process.env.guild) return
        var embed = {
            color: '#1bf531',
            description: `<@${member.id}> (${member.user.tag}) joined the server`,
        }

        member.guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({ embeds: [embed] })
            .then(() => {
                function sendWelcome() {
                    var embed = {
                        color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                        title: `${member.user.username} has joined the server!`,
                        description: `**${member.user.tag}** just joined the Discord.`,
                        thumbnail: {
                            url: member.user.avatarURL({ dynamic: true })
                        }
                    }
                    member.guild.channels.cache.find(channel => channel.name === "🌐general").send({ embeds: [embed] })
                        .then(msg => {
                            function deleteMSG() {
                                msg.delete()
                            }
                            setTimeout(deleteMSG, 1000 * 600)
                        })
                }
                setTimeout(sendWelcome, 1000)
            })
    });


    /*process.client.on('messageCreate', message => {

        if (message.content === '!motd')

            console.log('sent')

        var member = message.author

        const embed = {
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
        }

        const links = new MessageActionRow()
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

        message.author.send({ embeds: [embed], components: [links] });



    })*/

}