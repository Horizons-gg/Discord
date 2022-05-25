module.exports = async (client, message) => {
    if (![process.env.ticket.open, process.env.ticket.closed].includes(message.channel.parentId)) return
    if (message.author.bot) return

    let Ticket = await process.db.collection('tickets').findOne({ channel: message.channel.id })
    if (!Ticket) return

    Ticket.users[message.author.id] = {
        username: message.author.username,
        avatar: message.author.avatarURL()
    }

    Ticket.history.push({
        user: message.author.id,
        content: message.content,
        timestamp: message.createdTimestamp
    })

    await process.db.collection('tickets').updateOne({ channel: message.channel.id }, { $set: { users: Ticket.users, history: Ticket.history } })
}