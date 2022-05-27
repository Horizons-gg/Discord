const User = require('../../lib/Levels/user').User

let History = {}

module.exports = async (client, message) => {

    //? If the message is from a bot, ignore it.
    if (message.author.bot) return

    //? Add User to History if not already there.
    if (!History[message.author.id]) return History[message.author.id] = new Date()


    //? Check time diff of users last message.
    const Now = new Date()
    const Last = History[message.author.id]

    //? If the time diff is greater than the cooldown, ignore it.
    if (Now - Last < 1000 * 0) return


    //? Update Users History then add xp.
    History[message.author.id] = Now

    await User.addXP(message.author.id, Math.floor(Math.random() * 15) + 1).then(user => console.log(user))
}