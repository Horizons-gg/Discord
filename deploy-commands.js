const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const config = require('./config.json')



const commands = [

    //? General Usage Commands
    new SlashCommandBuilder().setName('help').setDescription('Replies with help information'),
    new SlashCommandBuilder().setName('se').setDescription('Replies with Space Engineers Server Connections'),

    new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Commands related to tickets')

        .addSubcommand(subcommand =>
            subcommand.setName('assist').
                setDescription('Replies with Support Ticket Quick access to assist confused users')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('create').
                setDescription('Creates a new ticket under your account')
        )

        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Grant a user access to this ticket')
                .addUserOption(option => option.setName('user').setDescription('Target User').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Revoke a users access to this ticket')
                .addUserOption(option => option.setName('user').setDescription('Target User').setRequired(true))
        ),


    //? Warning Commands
    new SlashCommandBuilder().setName('warn')
        .setDescription('Warn a user on the Network')
        .addUserOption(option => option.setName('user').setDescription('Target User').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true))
        .addIntegerOption(option => option.setName('rating').setDescription('Custom Violation Rating (1 Low-Risk | 10 High-Risk)').setRequired(false).setMinValue(0).setMaxValue(10)),

    new ContextMenuCommandBuilder().setName('Warn').setType(3).setDefaultPermission(true),


    //? Violation Commands
    new SlashCommandBuilder().setName('violation')
        .setDescription('Configure Network Violations')

        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Add a new violation')
                .addStringOption(option => option.setName('title').setDescription('Violation Title').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('Violation Description').setRequired(true))
                .addIntegerOption(option => option.setName('rating').setDescription('Violation Rating (1 Low-Risk | 10 High-Risk)').setRequired(true).setMinValue(1).setMaxValue(10))
                .addIntegerOption(option => option.setName('position').setDescription('Position in Array to Add Violation').setRequired(false))
        )

        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Remove a Violation')
                .addIntegerOption(option => option.setName('position').setDescription('Position in Array to Remove Violation').setRequired(true).setMinValue(0))
        )

        .addSubcommand(subcommand =>
            subcommand.setName('fetch')
                .setDescription('Fetch Information on a Violation/s')
                //.addIntegerOption(option => option.setName('violation').setDescription('Violation ID to Fetch').setRequired(false))
        )
]
    .map(command => command.toJSON())



const rest = new REST({ version: '9' }).setToken(config.discord.token)



if (process.argv[2] === 'add') rest.put(Routes.applicationGuildCommands(config.discord.client, config.discord.guild), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)

if (process.argv[2] === 'remove') rest.get(Routes.applicationGuildCommands(config.discord.client, config.discord.guild))
    .then(data => {
        const promises = []
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(config.discord.client, config.discord.guild)}/${command.id}`
            promises.push(rest.delete(deleteUrl))
        }
        console.log('Removed all application commands.')
        return Promise.all(promises)
    })