//!
//! Essentials
//!

const fs = require('fs')



//!
//! Initialization
//!

process.env = require('./config.json')

process.data = {
    servers: {},
    games: {}
}


const Patreon = require('./lib/patreon')
const Panel = require('./lib/panels')


process.env.ticket['raw'] = []
for (opt in process.env.ticket.options) {
    process.env.ticket.raw.push({
        value: opt,
        label: process.env.ticket.options[opt][0]
    })
}

process.env.roles['raw'] = []
for (opt in process.env.roles.options) {
    process.env.roles.raw.push({
        value: opt,
        label: process.env.roles.options[opt][0],
        description: process.env.roles.options[opt][1]
    })
}



//!
//! MongoDB
//!

const MongoClient = require('mongodb').MongoClient
MongoClient.connect(`mongodb://${process.env.mongo.host}`, async function(err, db) {
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



//!
//! Express
//!

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.listen(process.env.port, () => console.log(`API Listening on localhost:${process.env.port}`))

process.app = app



//? Initialization

for (game in process.env.games) {
    if (process.env.games[game]) require(`./Bots/${game}.js`).Start(process.env.games[game], game)
}

for (server in process.env.servers) {
    if (process.env.servers[server]) require(`./lib/servers.js`).Start(process.env.servers[server], server)
}

client.on('ready', () => {
    console.log(`Logged into ${client.user.tag}`)

    //? Init
    Patreon.Init()
    require('./lib/threads.js')(client)


    //? API
    app.get('/', (req, res) => {
        res.send(process.data)
    })

    app.get('/discord', (req, res) => {
        res.send(client.guilds.cache.get(process.env.guild))
    })


    //? Member Count
    async function Update() {
        client.user.setActivity(`${client.guilds.cache.get(process.env.discord.guild).memberCount} Members`, { type: 'WATCHING' })
    }
    setInterval(Update, 1000 * 60), Update()

})





//? Notifications
client.on('guildMemberAdd', member => require('./Notifications/guildMemberAdd.js')(member))
client.on('guildMemberRemove', member => require('./Notifications/guildMemberRemove.js')(member))
client.on('guildMemberUpdate', (oldMember, newMember) => require('./Notifications/guildMemberUpdate.js')(oldMember, newMember))


//? Interactions
client.on('interactionCreate', interaction => {

    if (interaction.isCommand()) return require(`./Commands/${interaction.commandName}.js`)(interaction)

    if (interaction.customId.includes('-')) var flag = interaction.customId.split('-')
    if (flag[0] === 'ticket') if (fs.existsSync(`./Ticket/${flag[1]}.js`)) return require(`./Ticket/${flag[1]}.js`)(interaction, flag)
    if (flag[0] === 'roles') if (fs.existsSync(`./Roles/${flag[1]}.js`)) return require(`./Roles/${flag[1]}.js`)(interaction, flag)

})


//? Message Commands
client.on('messageCreate', async message => {
    if (message.author.id !== "240786290600181761") return

    var args = message.content.trim().split(' ')
    if (args[0] !== '!panel') return
    message.channel.send(await Panel(args[1]))
    //message.delete()
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