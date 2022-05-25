const Panel = require('../../lib/panels')

module.exports = async (client, message) => {
    if (message.author.id !== "240786290600181761") return

    let args = message.content.trim().split(' ')
    if (args[0] !== '!panel') return
    message.channel.send(await Panel(args[1]) || 'No panel found!')
    message.delete()
}