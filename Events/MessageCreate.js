const fs = require('fs')

module.exports = (client) => {

    client.on('messageCreate', message => fs.readdir('./Events/MessageCreate', (err, scripts) => {
        if (err) return console.log(err)
        scripts.forEach(script => require(`./MessageCreate/${script}`)(client, message))
    }))

}