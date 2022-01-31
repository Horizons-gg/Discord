const { SlashCommandBuilder, userMention } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require('./config.json')

const commands = [
    new SlashCommandBuilder().setName('help').setDescription('Replies with help information.'),
    new SlashCommandBuilder().setName('se').setDescription('Replies with Space Engineers Server Connections.'),
    new SlashCommandBuilder().setName('ticket').setDescription('Replies with Support Ticket Quick access to assist confused users.'),
]
    .map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(config.discord.token)

rest.get(Routes.applicationGuildCommands(config.discord.client, config.discord.guild))
    .then(data => {
        const promises = []
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(config.discord.client, config.discord.guild)}/${command.id}`
            promises.push(rest.delete(deleteUrl))
        }
        return Promise.all(promises)
    })

rest.put(Routes.applicationGuildCommands(config.discord.client, config.discord.guild), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)