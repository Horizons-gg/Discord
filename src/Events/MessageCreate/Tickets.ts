import { Collections } from "@app/mongo"


export async function main(message) {
    if (message.author.bot) return

    const Ticket = await Collections.Tickets.findOne({ channel: message.channel.id })
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

    Collections.Tickets.updateOne({ channel: message.channel.id }, { $set: { users: Ticket.users, history: Ticket.history } })
}