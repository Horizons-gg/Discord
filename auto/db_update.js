
module.exports = function (app, client, mongodb) {

    if (process.env.DISCORD_ID !== '610606066451087370') return

    client.on('ready', async () => {
        var db = await mongodb.db("horizons").collection("users")

        var guild = await client.guilds.fetch(process.env.DISCORD_ID)

        var users = await db.find({}).toArray()

        for (user of users) {
            var member
            try {
                member = await guild.members.fetch(user.discord.id)
            } catch (error) {
                if (error.code !== 10007) continue
                db.deleteOne({ "_id": user.discord.id })
                console.log(`${user.discord.username}#${user.discord.discriminator} (${user.discord.id}) Deleted from the Database!`)
                continue
            }

            user.discord.avatar = member.user.avatar
            user.discord.username = member.user.username
            user.discord.discriminator = member.user.discriminator

            var userUpdate = {
                $set: {
                    "discord": user.discord
                }
            }

            await db.updateOne({ "_id": member.id }, userUpdate)
        }
    })

    client.on('messageCreate', async msg => {
        var db = await mongodb.db("horizons").collection("users")

        var user = await db.findOne({ "_id": msg.author.id })
        if (!user) return

        user.discord.avatar = msg.author.avatar
        user.discord.username = msg.author.username
        user.discord.discriminator = msg.author.discriminator

        var userUpdate = {
            $set: {
                "discord": user.discord
            }
        }

        await db.updateOne({ "_id": msg.author.id }, userUpdate)
    })

}