const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')



module.exports = (panel) => {


    if (panel === 'pronouns') {
        const Selection = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('roles-pronouns')
                    .setPlaceholder('Select Your Pronouns...')
                    .setMinValues(0)
                    .setMaxValues(3)
                    .addOptions([
                        {
                            value: 'he',
                            label: '✨ He/Him'
                        },
                        {
                            value: 'she',
                            label: '💞 She/Her'
                        },
                        {
                            value: 'they',
                            label: '💖 They/Them'
                        },
                        {
                            value: 'remove',
                            label: '❌ Remove',
                            description: 'Removes all your Pronouns'
                        }
                    ])
            )

        return {
            embeds: [{
                title: 'Pronouns - Everyone is Accepted!',
                description: `Here at Horizons we welcome anyone no matter how you identify!`,
                image: {
                    url: 'https://i.imgur.com/oDZrD1v.jpg'
                },
                color: '#d729e3'
            }],
            components: [Selection]
        }
    }


    if (panel === 'games') {
        const Row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('roles-games')
                    .setPlaceholder("Select Games you're interested in...")
                    .setMinValues(0)
                    .setMaxValues(process.env.roles.raw.length)
                    .addOptions(process.env.roles.raw.concat([{
                        value: 'remove',
                        label: '❌ Remove',
                        description: 'Removes all your Game Roles'
                    }]))
            )

        return {
            embeds: [{
                title: 'Games',
                description: `What games do you play?`,
                image: {
                    url: 'https://i.imgur.com/P8h3Tg7.jpg'
                },
                color: '#248cbf'
            }],
            components: [Row]
        }
    }


    if (panel === 'notifications') {
        const Row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('roles-notifications')
                    .setPlaceholder("Set Server Notifications...")
                    .setMinValues(0)
                    .setMaxValues(3)
                    .addOptions([
                        {
                            value: 'major',
                            label: '🔔 Major Announcements',
                            description: 'Receive Notifications for Any Important Announcements'
                        },
                        {
                            value: 'minor',
                            label: '🛎️ Minor Announcements',
                            description: 'Receive Notifications for Less Important Announcements'
                        },
                        {
                            value: 'stream',
                            label: '🎬 Live Stream Notifications',
                            description: 'Receive Notifications for Live Streams'
                        },
                        {
                            value: 'remove',
                            label: '❌ Remove',
                            description: 'Removes all your Notification Roles'
                        }
                    ])
            )

        return {
            embeds: [{
                title: 'Notifications',
                description: `What Notifications do you want enabled?`,
                image: {
                    url: 'https://i.imgur.com/Vpz196w.jpg'
                },
                color: '#fcba03'
            }],
            components: [Row]
        }
    }


}