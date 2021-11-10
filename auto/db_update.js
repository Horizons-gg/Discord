
module.exports = function () {

    /*if (process.env.DISCORD_ID !== '610606066451087370') return

    process.client.on('ready', async () => {
        var Users = await process.db.collection("users")

        var guild = await process.client.guilds.fetch(process.env.DISCORD_ID)

        var users = await Users.find({}).toArray()

        for (user of users) {
            var member
            try {
                member = await guild.members.fetch(user.discord.id)
            } catch (error) {
                if (error.code !== 10007) continue
                Users.deleteOne({ "_id": user.discord.id })
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

            await Users.updateOne({ "_id": member.id }, userUpdate)
        }
    })

    process.client.on('messageCreate', async msg => {
        var Users = await mongoUsers.Users("horizons").collection("users")

        var user = await Users.findOne({ "_id": msg.author.id })
        if (!user) return

        user.discord.avatar = msg.author.avatar
        user.discord.username = msg.author.username
        user.discord.discriminator = msg.author.discriminator

        var userUpdate = {
            $set: {
                "discord": user.discord
            }
        }

        await Users.updateOne({ "_id": msg.author.id }, userUpdate)
    })*/

}