module.exports = function () {

    /*
    async function checkBirthdays() {
        var now = new Date()

        var db = await mongodb.db("horizons").collection("users")
        var users = await db.find({}).toArray()

        for (user of users) {
            try {
                if (user.personal.dob === '') { continue }
                var birthday = new Date(user.personal.dob)

                if (birthday.getDate() !== now.getDate() || birthday.getMonth() !== now.getMonth()) { continue }

                var guild = client.guild.cache.get(process.env.DISCORD_ID)
                var channel = guild.channels.cache.find(channel => channel.name === "🌐general")

                var name
                var age = now.getFullYear() - birthday.getFullYear()

                if (user.personal.first_name !== '') {
                    name = user.personal.first_name
                } else {
                    name = user.discord.username
                }

                var easteregg = ''
                if (age < 0) easteregg = "\nApparently you haven't been born yet? Well that's interesting..."


                channel.send(`<@${user.discord.id}>,\n`, {
                    embeds: [{
                        "title": `🎂 Happy Birthday ${name}! 🎉`,
                        "description": `Happy Birthday <@${user.discord.id}>!\nCongratulations on turning **${age}** years old!${easteregg}\n\nWe hope you have a great day with lots of love from family and friends.`,
                        "thumbnail": {
                            "url": "https://media.tenor.com/images/cbffabf2ad419f9d856cd067dd08192a/tenor.gif"
                        },
                        "footer": {
                            "text": "From the Horizons Staff Team"
                        },
                        "color": '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
                    }]
                })

            } catch { continue }
        }

        setTimeout(checkBirthdays, 86400000)
    }

    var now = new Date()
    var countdown = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 00, 00, 00) - now
    if (countdown < 0) {
        countdown += 86400000
    }
    setTimeout(checkBirthdays, countdown)
    */

}