var guild

module.exports = async function (app, client, mongodb) {

    if (process.env.DISCORD_ID !== '610606066451087370') return

    guild = client.guilds.cache.get('610606066451087370')
    var channel = guild.channels.cache.get('719381556145160232')

    //Pronouns
    var male = await guild.roles.fetch('825129202008326176'), female = await guild.roles.fetch('825129653747974164'), they = await guild.roles.fetch('825129838133510145')

    var embed = {
        title: "🎭 Pronouns",
        description: "Everyone is welcome here, so we're giving you all the option to add pronouns to your account.\n\n✨ | He/Him\n💕 | She/Her\n💖 | Them/They",
        color: "#da5ee6",
        thumbnail: { url: "https://i.imgur.com/oNPfjAW.png" }
    }

    message = await channel.messages.fetch('825147161913851964')

    await message.edit({ embeds: [embed] })
        .then(message.react('✨'))
        .then(message.react('💕'))
        .then(message.react('💖'))


    //Games
    var se = await guild.roles.fetch('622634027484184616'), eco = await guild.roles.fetch('776939425056817162'), mc = await guild.roles.fetch('709653288634548325'), squad = await guild.roles.fetch('871234654424952873'), scum = await guild.roles.fetch('874233439501561856'), elite = await guild.roles.fetch('713305276563849367')

    var embed = {
        title: `🎮 Games We Play`,
        description: `Join our Dedicated Game Roles to get updates on things you're interested in!\n\n🚀 | Space Engineers - ${se.members.map(member => member.user.id).length} members\n<:squad:871231649252270170> | Squad - ${squad.members.map(member => member.user.id).length} members\n🌏 | Eco - ${eco.members.map(member => member.user.id).length} members\n<:scum:874434456004472944> | SCUM - ${scum.members.map(member => member.user.id).length} members\n🔨 | Minecraft - ${mc.members.map(member => member.user.id).length} members\n<:elite:749717235731398696> | Elite Dangerous - ${elite.members.map(member => member.user.id).length} members`,
        color: "#6bdb71",
        thumbnail: { url: "https://i.imgur.com/ayLHALo.jpg" }
    }

    message = await channel.messages.fetch('825147164102754364')
    await message.edit({ embeds: [embed] })
        .then(message.react('🚀'))
        .then(message.react(client.emojis.cache.get("871231649252270170")))
        .then(message.react('🌏'))
        .then(message.react(client.emojis.cache.get("874434456004472944")))
        .then(message.react('🔨'))
        .then(message.react(client.emojis.cache.get("749717235731398696")))


    //Notifications
    var embed = {
        title: "Notifications",
        description: "Recieve pings for Server Announcements.\n\n🔔 | Major Announcements - Important\n🛎 | Minor Announcements - Not that Important\n🎬 | Live Stream Notifications - <#748119688113946654>",
        color: "#f0e967",
        thumbnail: { url: "https://canopytools.com/wp-content/uploads/2019/10/alert-icon-17.png" },
    }

    message = await channel.messages.fetch('825147584075137035')
    await message.edit({ embeds: [embed] })
        .then(message.react('🔔'))
        .then(message.react('🛎'))
        .then(message.react('🎬'))




    //Reaction Added
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return
        var member = await guild.members.fetch(user.id)
        if (member.id === client.user.id) return

        if (guild.id === '610606066451087370') {

            //Pronouns
            if (reaction.message.id === '825147161913851964') {
                if (reaction.emoji.name === '✨') {
                    member.roles.add('825129202008326176')
                }
                if (reaction.emoji.name === '💕') {
                    member.roles.add('825129653747974164')
                }
                if (reaction.emoji.name === '💖') {
                    member.roles.add('825129838133510145')
                }
            }

            //Games
            if (reaction.message.id === '825147164102754364') {
                if (reaction.emoji.name === '🚀') {
                    member.roles.add('622634027484184616')
                }
                if (reaction.emoji === client.emojis.cache.get("871231649252270170")) {
                    member.roles.add('871234654424952873')
                }
                if (reaction.emoji.name === '🌏') {
                    member.roles.add('776939425056817162')
                }
                if (reaction.emoji === client.emojis.cache.get("874434456004472944")) {
                    member.roles.add('874233439501561856')
                }
                if (reaction.emoji.name === '🔨') {
                    member.roles.add('709653288634548325')
                }
                if (reaction.emoji === client.emojis.cache.get("749717235731398696")) {
                    member.roles.add('713305276563849367')
                }
            }

            //Notifications
            if (reaction.message.id === '825147584075137035') {
                if (reaction.emoji.name === '🔔') {
                    member.roles.add('749710200432492575')
                }
                if (reaction.emoji.name === '🛎') {
                    member.roles.add('749710316862046258')
                }
                if (reaction.emoji.name === '🎬') {
                    member.roles.add('749734519824711710')
                }
            }
        }

    });

    //Reaction Removed
    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return
        var member = await guild.members.fetch(user.id)
        if (member.id === client.user.id) return

        if (guild.id === '610606066451087370') {

            //Pronouns
            if (reaction.message.id === '825147161913851964') {
                if (reaction.emoji.name === '✨') {
                    member.roles.remove('825129202008326176')
                }
                if (reaction.emoji.name === '💕') {
                    member.roles.remove('825129653747974164')
                }
                if (reaction.emoji.name === '💖') {
                    member.roles.remove('825129838133510145')
                }
            }

            //Games
            if (reaction.message.id === '825147164102754364') {
                if (reaction.emoji.name === '🚀') {
                    member.roles.remove('622634027484184616')
                }
                if (reaction.emoji === client.emojis.cache.get("871231649252270170")) {
                    member.roles.remove('871234654424952873')
                }
                if (reaction.emoji.name === '🌏') {
                    member.roles.remove('776939425056817162')
                }
                if (reaction.emoji === client.emojis.cache.get("874434456004472944")) {
                    member.roles.remove('874233439501561856')
                }
                if (reaction.emoji.name === '🔨') {
                    member.roles.remove('709653288634548325')
                }
                if (reaction.emoji === client.emojis.cache.get("749717235731398696")) {
                    member.roles.remove('713305276563849367')
                }
            }

            //Notifications
            if (reaction.message.id === '825147584075137035') {
                if (reaction.emoji.name === '🔔') {
                    member.roles.remove('749710200432492575')
                }
                if (reaction.emoji.name === '🛎') {
                    member.roles.remove('749710316862046258')
                }
                if (reaction.emoji.name === '🎬') {
                    member.roles.remove('749734519824711710')
                }
            }
        }

    })

}