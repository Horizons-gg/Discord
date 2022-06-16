const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')



module.exports = (panel) => {

    //!
    //! Role Assignment Panels
    //!

    if (panel === 'pronouns') {
        const Selection = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('roles-pronouns')
                .setPlaceholder('Select Your Pronouns...')
                .setMinValues(0)
                .setMaxValues(3)
                .addOptions([{
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
                .addOptions([{
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


    //!
    //! Info & Rules Panels
    //!

    if (panel === 'rules1') {
        return {
            embeds: [{
                title: 'Community Rules',
                description: `What Notifications do you want enabled?`,
                author: {
                    name: 'Rules [1/3]'
                },
                color: '#ff672b',
                description: `
                    **1.** All Discord Terms of Service Apply - https://discordapp.com/terms.
                    
                    **2.** No harassment of any kind.
                    
                    **3.** No spamming.
                    
                    **4.** Self promotion such as twitch, youtube, ect. is allowed in <#622638115718299679>. However, Discord servers and other communities are to refer to <@&753919914837803068>. This includes within Voice Channels.
                    
                    **5.** Follow the directions of <@&688869302434398213>.
                    
                    **6.** NSFW is NOT permitted anywhere in this discord.
                    
                    **7.** Do not harass, abuse, threaten others, or collect, or attempt to collect, personal information about users or without their consent.
                    
                    **8.** Political speech must remain civil, Hate speech of any kind is forbidden.
                    
                    **9.** Do not DM or Ping staff members or other members for no reason. Please submit Support Ticket's in <#772794459355349013> if you need help.
                    
                    **10.** Any attempt of circumventing rules to void consequences, your reasons will be ignored. (If you try circumventing this rule, I will personally ban you on the spot)
                `,
            }]
        }
    }

    if (panel === 'rules2') {
        return {
            embeds: [{
                title: 'Community Guidelines',
                author: {
                    name: 'Rules [2/3]'
                },
                color: '#ff672b',
                description: `
                    **1.** All Discord Community Guidelines Apply - https://discordapp.com/guidelines.
                    **2.** Drunk & Disorderly behavior will __NOT__ be tolerated.
                `,
            }]
        }
    }

    if (panel === 'rules3') {
        return {
            embeds: [{
                title: 'Staff Rules',
                author: {
                    name: 'Rules [3/3]'
                },
                color: '#ff672b',
                description: `
                    **1.** No abuse of perms such as deafen, mute, nickname change, etc. Unless absolutely necessary.
                    
                    **2.** Respect everyone. No use of derogatory terms.
                                                            
                    **3.** All staff suggestions go to <@&753919914837803068>.
                                        
                    **4.** Staff members are to be mature and patient with the community, showing immediate aggression when something doesn't go to plan is very immature and untrustworthy.
                `,
            }]
        }
    }



}