
module.exports = (member) => {

    //? Guild Check
    if (member.guild.id !== process.env.discord.guild) return


    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)


    //? Landing Pad Notification
    Guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({
        embeds: [{
            color: '#f51b1b',
            description: `${member.user.tag} left the server`
        }]
    })

}