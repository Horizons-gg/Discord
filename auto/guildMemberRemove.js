
module.exports = function (app, client, mongodb) {

    client.on('guildMemberRemove', member => {
        if (member.guild.id !== process.env.DISCORD_ID) return
        var embed = {
            color: '#f51b1b',
            description: `${member.user.tag} left the server`,
        }
        member.guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({ embeds: [embed] })
    });

}