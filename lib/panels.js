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
                            value: 'helicopter',
                            label: '🚁 Helicopter',
                            description: 'Helicopter Helicopter'
                        },
                        {
                            value: 'kayak',
                            label: '🛶 Kayak',
                            description: "Cruising down the stream"
                        },
                        {
                            value: 'wizard',
                            label: '🧙‍♂️ Wizard',
                            description: "You're a Wizard Larry!"
                        },
                        {
                            value: 'puffy',
                            label: '☁️ PuffyKinkaChu',
                            description: "cheater"
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
                    
                    **9.** Avoid contacting <@&753919914837803068>'s unless necessary. Please submit Support Ticket's in <#772794459355349013>.
                    
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






    //!
    //! Temp
    //!

    if (panel === 'rustanc') {
        const Row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('roles-add-rust')
                    .setEmoji('941298558026514522')
                    .setStyle('SUCCESS')
                    .setLabel('Get Rust Notifications!')
            )

        return {
            content: '@everyone',
            embeds: [{
                title: 'Get Ready for The Official Rust Launch <t:1644544800:R>!',
                description: `
                    We're excited to announce that Rust is finally here!
                    We've been working hard to get the server up and running and we're ready to launch!
                    We're expecting 30+ players on launch on a 3.5k map, server will wipe bi-weekly and a monthly BP wipe!
                    __Remember that Staff Members with in-game permissions are NOT allowed to play!__
                `,
                fields: [
                    {
                        name: 'What will Softcore Rust be like?',
                        value: `
                            >>> For those of you that have lost interest because the server is "Softcore", please hear us out first!

                            The only differences between our Softcore Server and other Rust servers is that you can Spawn at Safezones such as Outpost and when you die, you have the option to reclaim 50% of your inventory at Reclaim Stations within Safezones (completely randomized and your hotbar and armour items will always stay on your body!).
                        `
                    },
                    {
                        name: 'What Modifications have been made to the Server?',
                        value: `
                            >>> We've been working hard to make the server as fun and enjoyable as possible.
                            The server is 2x, this includes gathering, stacking, smelting, recycling, and crafting speeds!
                            We have also setup some sweet sorting additions so that you can quickly sort your chests and quickly split items in furnaces!
                        `
                    },
                    {
                        name: 'How does Skinbox work?',
                        value: `
                            >>> Nitro Boosters & Patreons will have access to the Skinbox, this is a premium plugin we bought that allows you to change the skins of almost any item in the game for free!
                            There are hundreds of skins to choose from, and you can change them to whatever you want, whenever you want!
                            Nitro Boosters have to pay scrap to apply skins but Patreons can apply skins for free!
                            *Use the commands \`/sb\` or \`/skinbox\` in game to access the user interface.*
                        `
                    },
                    {
                        name: 'How do I link Discord to Rust?',
                        value: `
                            >>> Simply type \`/auth\` into the rust chat and direct message <@777592678443384832> with the code received in game!
                        `
                    },
                    {
                        name: 'What are the Rules?',
                        value: `
                            >>> The Rules are Simple, don't cheat and don't be a dick. (Thats inferring at racism, sexism, homophobia, transphobia, etc.) We won't be having any of it.
                        `
                    },
                    {
                        name: 'How do I connect?',
                        value: `
                            >>> We made this part a piece of cake!
                            Simple click here! <steam://connect/horizons.gg:28015>
                            Or search for \`Horizons | 2x | Softcore | Skinbox\` in modded.
                            Or press F1 and type \`client.connect horizons.gg:28015\`
                        `
                    },
                    {
                        name: 'Server Launches <t:1644544800:R>',
                        value: '\u200b'
                    }
                ],
                image: {
                    url: 'https://i.imgur.com/MJH7FoI.png'
                },
                color: '#ce422b'
            },
        ],
            components: [Row]
        }
    }



}