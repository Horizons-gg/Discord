//!
//! Essentials
//!

const fs = require('fs')

if (!fs.existsSync('./undefined')) fs.mkdirSync('./undefined')
if (!fs.existsSync('./undefined/temp')) fs.mkdirSync('./undefined/temp')

if (!fs.existsSync('./cache')) fs.mkdirSync('./cache')
if (!fs.existsSync('./cache/systems')) fs.mkdirSync('./cache/systems')




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
for (const opt in process.env.ticket.options) {
    process.env.ticket.raw.push({
        value: opt,
        label: process.env.ticket.options[opt][0]
    })
}

process.env.roles['raw'] = []
for (const opt in process.env.roles.options) {
    process.env.roles.raw.push({
        value: opt,
        label: process.env.roles.options[opt][0],
        description: process.env.roles.options[opt][1]
    })
}

process.env.systemsArray = []
for (const system in process.env.servers) {
    process.env.systemsArray.push(system)
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
let selectedIntents = []
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

app.set('view engine', 'ejs')
app.set('trust proxy', 'loopback')

app.use('/', express.static('public'))

process.app = app



//? Initialization

for (const game in process.env.games) {
    if (process.env.games[game]) require(`./Bots/${game}.js`).Start(process.env.games[game], game)
}

for (const server in process.env.servers) {
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
        console.log(req.ip)
    })

    app.get('/discord', (req, res) => {
        res.send(client.guilds.cache.get(process.env.discord.guild))
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

    //? Commands

    if (interaction.isCommand()) return require(`./Commands/SlashCommands/${interaction.commandName}.js`)(interaction)
    if (interaction.isContextMenu()) return require(`./Commands/ContextMenuCommands/${interaction.commandName}.js`)(interaction)



    //? Interfaces

    if (!interaction.customId) return
    const Flag = interaction.customId.split('-') || interaction.customId

    if (fs.existsSync(`./Interfaces/${Flag[0]}/${Flag[1]}.js`)) return require(`./Interfaces/${Flag[0]}/${Flag[1]}.js`)(interaction, Flag)

})


//? Message Commands
client.on('messageCreate', async message => {
    if (message.author.id !== "240786290600181761") return

    let args = message.content.trim().split(' ')
    if (args[0] !== '!panel') return
    message.channel.send(await Panel(args[1]))
    //message.delete()
})


//? Ticket Messages
client.on('messageCreate', async message => {
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
})





//? System Statistics
const Generator = require('./lib/generator')
Generator.PrepBrowser()
setInterval(Generator.Systems, 1000 * 60)

app.get('/generate/system', (req, res) => {

    res.render('system', { ...process.data.servers[req.query.id] }, (err, html) => {
        if (err) return res.status(400).send()
        res.send(html)
    })

})