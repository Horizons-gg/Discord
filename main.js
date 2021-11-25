//!
//! Modules
//!

const fs = require('fs')

if (!fs.existsSync('config.json')) return console.log('config.json not found!'), setTimeout(() => process.exit(1), 5000)
process.env = JSON.parse(fs.readFileSync('config.json', 'utf8'))
process.data = {
    servers: {},
    games: {}
}



//!
//! MongoDB
//!

const MongoClient = require('mongodb').MongoClient
MongoClient.connect(`mongodb://${process.env.db.host}:${process.env.db.port}`, function (err, db) {
    if (err) throw err;
    console.log('Connected to the database.')
    process.db = db.db(process.env.db.database)
})



//!
//! Discord.js
//!

const { Client, Intents } = require('discord.js')
var selectedIntents = []
for (intent in Intents.FLAGS) { selectedIntents.push(Intents.FLAGS[intent]) }
const client = new Client({ intents: selectedIntents })
client.login(process.env.token)

process.client = client



//!
//! Express
//!

const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.listen(process.env.port, () => console.log(`Listening on port ${process.env.port}`))

process.app = app



//!
//! Application
//!

for (game in process.env.games) {
    if (process.env.games[game]) require(`./games/${game}.js`).Start(process.env.games[game], game)
}

for (server in process.env.servers) {
    if (process.env.servers[server]) require(`./server.js`).Start(process.env.servers[server], server)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, Starting Primary Discord Framework...`)

    for (file of fs.readdirSync('./auto')) {
        if (file.includes('.js')) require(`./auto/${file}`)(client)
    }
    for (file of fs.readdirSync('./extra')) {
        if (file.includes('.js')) require(`./extra/${file}`)()
    }
    for (file of fs.readdirSync('./support')) {
        if (file.includes('.js')) require(`./support/${file}`)()
    }

    app.get('/', (req, res) => {
        res.send(process.data)
    })

    app.get('/discord', (req, res) => {
        res.send(client.guilds.cache.get(process.env.guild))
    })

})