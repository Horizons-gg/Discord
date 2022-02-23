var Process, Discord
const Spawn = require('child_process').spawn

const config = require('./config.json')

const { Client, Intents } = require('discord.js')
var selectedIntents = []
for (intent in Intents.FLAGS) { selectedIntents.push(Intents.FLAGS[intent]) }
const client = new Client({ intents: selectedIntents })
client.login(config.discord.token)
client.on('ready', () => {
    console.log(`Handle Logged in as ${client.user.tag}!`)
    Discord = client.guilds.cache.get(config.discord.guild).channels.cache.find(channel => channel.name === '📱server-console')
    Start()
})


function Start() {
    Process = Spawn('node', ['./main.js'])

    Process.stdout.on('data', data => console.log(data.toString()))
    Process.stderr.on('data', data => {
        console.log(data.toString())
        Discord.send({ content: `<@240786290600181761> **Error Occurred in Discord Framework!**\n\`\`\`js\n${data.toString()}\`\`\`` }).catch(err => console.log(err))
    })

    Process.on('exit', (code) => {
        console.log(code)
        Start()
    })
}