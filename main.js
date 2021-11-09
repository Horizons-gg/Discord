//!
//! Modules
//!

const fs = require('fs')

if (!fs.existsSync('config.json')) return console.log('config.json not found!'), setTimeout(() => process.exit(1), 5000)
process.env = JSON.parse(fs.readFileSync('config.json', 'utf8'))



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
//! Express
//!

const express = require('express')
const app = express()
app.listen(process.env.port, () => console.log(`Listening on port ${process.env.port}`))

process.app = app



//!
//! Application
//!

for (game in process.env.games) {
    if (process.env.games[game]) require(`./games/${game}.js`).Start(process.env.games[game], game)
}