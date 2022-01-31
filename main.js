//!
//! Initialization
//!

process.env = require('./config.json')

process.env.ticket['raw'] = []
for (opt in process.env.ticket.options) {
    process.env.ticket.raw.push({
        value: opt,
        label: process.env.ticket.options[opt][0]
    })
}



//!
//! MongoDB
//!

const MongoClient = require('mongodb').MongoClient
MongoClient.connect(`mongodb://${process.env.mongo.host}`, async function (err, db) {
    if (err) throw err;
    console.log('Connected to the database.')
    process.db = db.db(process.env.mongo.database)
})



//!
//! Discord.js
//!

const { Client, Intents } = require('discord.js')
var selectedIntents = []
for (intent in Intents.FLAGS) { selectedIntents.push(Intents.FLAGS[intent]) }
const client = new Client({ intents: selectedIntents })
client.login(process.env.discord.token)
process.client = client

client.on('ready', () => console.log(`Logged into ${client.user.tag}`))



//? Interactions
client.on('interactionCreate', interaction => {

    if (interaction.isCommand()) return require(`./Commands/${interaction.commandName}.js`)(interaction)

    if (interaction.customId.includes('-')) var flag = interaction.customId.split('-')
    if (flag[0] === 'ticket') return require(`./Ticket/${flag[1]}.js`)(interaction, flag)

})


//? Ticket Messages
client.on('messageCreate', async message => {
    if (![process.env.ticket.open, process.env.ticket.closed].includes(message.channel.parentId)) return
    if (message.author.bot) return

    var Ticket = await process.db.collection('tickets').findOne({ channel: message.channel.id })
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
})