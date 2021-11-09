const essentials = require('../../functions/essentials.js')

module.exports = async function (app, client, mongodb) {

    client.on('messageCreate', async msg => {
        if (msg.author.bot) return
        var tradeDb = await mongodb.db("horizons").collection("trade")
        var tradeData = await tradeDb.findOne({ "_id": msg.author.id })

        if (!tradeData) {
            var req = {}
            req['tradeDb'] = tradeDb
            req['ret'] = msg.author
            tradeData = await essentials.createTradeDate(req, null, null, msg.author.id)
        }

        if (Math.floor(Math.random() * 3) !== 0) return
        tradeDb.updateOne({ "_id": msg.author.id }, { $set: { "credits": tradeData.credits += 1 } })
    })

    client.on('messageCreate', async msg => {
        if (msg.author.id !== '302050872383242240') return
        var tradeDb = await mongodb.db("horizons").collection("trade")

        var description = msg.embeds[0].description
        var userId = description.split('<@')[1].split('>')[0]

        var tradeData = await tradeDb.findOne({ "_id": userId })

        if (!description.includes('Bump done')) return

        msg.channel.send(`Thank you for Bumping the Server <@${userId}>!\n250cr has been Transered to your account as a kind gesture 😊`)

        tradeDb.updateOne({ "_id": userId }, { $set: { "credits": tradeData.credits += 100 } })
    })

}