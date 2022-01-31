async function Check(User, Roles) {

    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    User = await Guild.members.fetch(User)

    //? Check Roles
    for (role of Roles) {
        if (User.roles.cache.some(r => r.name === role)) return true
    }

    return false
}



module.exports = {
    Check
}