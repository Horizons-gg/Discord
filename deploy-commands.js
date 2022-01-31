const { SlashCommandBuilder, userMention } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require('./config.json')



const commands = [
    new SlashCommandBuilder().setName('help').setDescription('Replies with help information.'),
    new SlashCommandBuilder().setName('se').setDescription('Replies with Space Engineers Server Connections.'),
    new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Commands related to tickets.')

        .addSubcommand(subcommand =>
            subcommand.setName('assist').
                setDescription('Replies with Support Ticket Quick access to assist confused users.')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('create').
                setDescription('Creates a new ticket under your account.')
        )

        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Grant a user access to this ticket.')
                .addUserOption(option => option.setName('user').setDescription('Target User'))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Revoke a users access to this ticket.')
                .addUserOption(option => option.setName('user').setDescription('Target User'))
        ),
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