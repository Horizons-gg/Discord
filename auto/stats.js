const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

const fs = require('fs')

module.exports = async function () {

    if (process.guild !== '610606066451087370') return

    var guild = await process.client.guilds.fetch(process.env.guild)

    async function statsUpdate() {
        process.client.user.setActivity(`${process.client.guilds.cache.get(process.env.guild).memberCount} Members`, { type: 'WATCHING' })
    } setInterval(statsUpdate, 1000 * 20), statsUpdate()

    process.client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return

        var user = await guild.members.fetch(interaction.user.id)

        if (interaction.customId === 'become-seeder') {
            var role = guild.roles.cache.find(r => r.name === '🌱Seeder')
            user.roles.add(role)
            await interaction.reply({ content: 'You have become a seeder!', ephemeral: true })
        }

        if (interaction.customId === 'leave-seeder') {
            var role = guild.roles.cache.find(r => r.name === '🌱Seeder')
            user.roles.remove(role)
            await interaction.reply({ content: 'You are no longer on the seeding team.', ephemeral: true })
        }
    })


    //! Thread Stats
    async function GetThread(Parent, Thread) {
        var channel = guild.channels.cache.find(c => c.name === Parent)
        var thread = channel.threads.cache.find(t => t.name === Thread)

        if (!thread) {
            var archived = await channel.threads.fetchArchived({ fetchAll: true }, true)
            thread = archived.threads.find(t => t.name === Thread)

            if (!thread) {
                thread = await channel.threads.create({
                    name: Thread,
                    autoArchiveDuration: 10080
                })
            }
        }

        if (thread.archived) {
            thread.send('Unarchiving Thread...').then(msg => msg.delete())
            return false
        }
        else return thread
    }

    //? Refresh
    async function Refresh() {

        if (!fs.existsSync('./cache/threads.json')) await fs.writeFileSync('./cache/threads.json', '{}')
        var strg = JSON.parse(await fs.readFileSync('./cache/threads.json'))

        if (!strg['squad']) strg['squad'] = {}
        if (!strg['eco']) strg['eco'] = {}

        //? Squad Players
        var thread = await GetThread('💣squad', '🏅leaderboards')
        if (thread) {

            if (fs.existsSync('C:\\Applications\\Squad KD\\teams.json')) {
                var teams = JSON.parse(fs.readFileSync('C:\\Applications\\Squad KD\\teams.json'))
                var Team1 = teams.Team1
                var Team2 = teams.Team2

                Team1Names = [], Team2Names = []
                var Team1Str = '>>> '
                var Team2Str = '>>> '
                for (var player of Team1) {
                    Team1Str += `${player.name}: \`${player.kills}K | ${player.deaths}D\`\r`
                    Team1Names.push(player.name)
                }
                for (var player of Team2) {
                    Team2Str += `${player.name}: \`${player.kills}K | ${player.deaths}D\`\r`
                    Team2Names.push(player.name)
                }

                if (!Team1Str.includes('\r')) Team1Str = "No Players"
                if (!Team2Str.includes('\r')) Team2Str = "No Players"

                var embed = {
                    title: `🏅 Leaderboards 🏅`,
                    color: '#eb4034',
                    fields: [
                        { name: `Team 1 - ${Team1.length} Players`, value: Team1Str, inline: true },
                        //{ name: "\u200B", value: "\u200B", inline: true },
                        { name: `Team 2 - ${Team2.length} Players`, value: Team2Str, inline: true }
                    ],
                    timestamp: new Date()
                }

                var msg = null
                if (strg.squad['leaderboard']) msg = await thread.messages.fetch(strg.squad['leaderboard']).catch((e) => console.log(e))
                if (!msg) await thread.send({ embeds: [embed] }).then(msg => strg.squad['leaderboard'] = msg.id)
                else await msg.edit({ embeds: [embed] })
            }
        }

        //? Squad Seeding
        var thread = await GetThread('💣squad', '🌱seeding')
        if (thread) {
            var embed = {
                title: "🌱 Squad Seeding 🌱",
                color: "#4ce051",
                description: ">>> Receive Alerts for Seeding Events and Support the Community Grow!"
            }
            var row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('become-seeder')
                        .setLabel('🌱 Become a Seeder!')
                        .setStyle('SUCCESS'),

                    new MessageButton()
                        .setCustomId('leave-seeder')
                        .setLabel('Stop Seeding')
                        .setStyle('DANGER')
                )

            var msg = null
            if (strg.squad['seeding']) msg = await thread.messages.fetch(strg.squad['seeding']).catch((e) => console.log(e))
            if (!msg) await thread.send({ embeds: [embed], components: [row] }).then(msg => strg.squad['seeding'] = msg.id)
            else await msg.edit({ embeds: [embed], components: [row] })
        }



        //? Eco Rules
        var thread = await GetThread('🌏eco', '📗rules')
        if (thread) {
            var embed = {
                title: "🌏 Eco Rules 📗",
                color: "#4ce051",
                description: ">>> Coming Soon!"
            }

            var msg = null
            if (strg.eco['rules']) msg = await thread.messages.fetch(strg.eco['rules']).catch((e) => console.log(e))
            if (!msg) await thread.send({ embeds: [embed] }).then(msg => strg.eco['rules'] = msg.id)
            else await msg.edit({ embeds: [embed] })
        }


        fs.writeFileSync('./cache/threads.json', JSON.stringify(strg, null, '\t'))
    } setInterval(Refresh, 1000 * 60), Refresh()

}