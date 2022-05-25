async function Check(User, Roles) {

    //? Prerequisites
    const Client = process.client
    const Guild = Client.guilds.cache.get(process.env.discord.guild)
    User = await Guild.members.fetch(User)

    //? Check Roles
    for (const role of Roles) {
        if (User.roles.cache.some(r => r.name === role)) return true
    }

    return false
}



module.exports = {
    Check
}