import { Routes, SlashCommandBuilder, ContextMenuCommandBuilder } from 'discord.js'
import { REST } from '@discordjs/rest'
import Config from '@lib/config'

const rest = new REST({ version: '10' }).setToken(Config.discord.token)

const commands = [
    //? General Usage Commands
    new SlashCommandBuilder().setName('help').setDescription('Replies with help information'),
    new SlashCommandBuilder().setName('se').setDescription('Replies with Space Engineers Server Connections'),
    new SlashCommandBuilder().setName('support').setDescription('Replies with Support Interface'),


    //? Admin Commands
    new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Creates Interactive Panel in the current channel')
        .setDefaultMemberPermissions(8)
        .addStringOption(option => option.setName('name').setDescription('Name of the panel').setRequired(true)),



    //? Ticket Commands
    new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Commands related to tickets')

        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Creates a new ticket under your account')
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
        )

        .addSubcommand(subcommand =>
            subcommand.setName('priority')
                .setDescription('Set the priority of this ticket')
                .addStringOption(option => option.setName('level').setDescription('Specify to level of priority for this ticket').setRequired(true).addChoices(
                    { name: 'Low Priority', value: 'low' },
                    { name: 'Medium Priority', value: 'med' },
                    { name: 'High Priority', value: 'high' }
                ))
        )

        .addSubcommand(subcommand =>
            subcommand.setName('description')
                .setDescription('Set the description for this ticket')
                .addStringOption(option => option.setName('description').setDescription('Set the description for this ticket').setMaxLength(1024).setRequired(true))
        ),


    //? Role Commands
    new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Commands related to roles')
        .setDefaultMemberPermissions(8)

        .addSubcommand(subcommand =>
            subcommand.setName('channel')
                .setDescription('Sets the channel for role selection')
                .addChannelOption(option => option.setName('channel').setDescription('Target Channel to be used for role selection').setRequired(true))
        ),

    //TODO: Continue Working on Role Commands



    //? Network Bot Commands
    new SlashCommandBuilder().setName('bot')
        .setDescription('Commands related to extra Horizons Bots such as Game & Dedicated Server Bots')
        .setDefaultMemberPermissions(8)

        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Add a new bot to the network')
                .addStringOption(option => option.setName('type').setDescription('Type of bot').setRequired(true).addChoices(
                    { name: 'Game Bot', value: 'game' },
                    { name: 'Dedicated Server Bot', value: 'server' }
                ))
                .addUserOption(option => option.setName('bot').setDescription('Target Bot to be added').setRequired(true))
                .addStringOption(option => option.setName('token').setDescription('The Token for the Bot').setRequired(true))
                .addStringOption(option => option.setName('tag').setDescription('Add a tag to this bot to help keep track of it (Must be unique and have no spaces)').setRequired(true))
        )

        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Remove a bot from the network')
                .addUserOption(option => option.setName('bot').setDescription('Target Bot to be removed').setRequired(true))
        )

        .addSubcommand(subcommand =>
            subcommand.setName('edit')
                .setDescription('Edit a bot in the network')
                .addUserOption(option => option.setName('bot').setDescription('Target Bot to be edited').setRequired(true))
                .addStringOption(option => option.setName('token').setDescription('The Token for the Bot').setRequired(false))
                .addStringOption(option => option.setName('tag').setDescription('The tag for this bot that helps keep track of it (Must be unique and have no spaces)').setRequired(false))
                .addStringOption(option => option.setName('host').setDescription('The server address and port of the server (Game: 0.0.0.0:1234 | Server: 0.0.0.0/domain.com)').setRequired(false))
                .addStringOption(option => option.setName('method').setDescription('The Method the Bot Uses to Query Data (Only for Game Servers)').setRequired(false).addChoices(
                    { name: 'Valve Standard', value: 'valve' },
                    { name: 'Arma 3', value: 'arma3' },
                    { name: 'Eco', value: 'eco' },
                    { name: 'Minecraft', value: 'minecraft' },
                    { name: 'Squad', value: 'squad' }
                ))
        )

        .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable a Bot on the Network').addUserOption(option => option.setName('bot').setDescription('Target Bot to be enabled').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable a Bot on the Network').addUserOption(option => option.setName('bot').setDescription('Target Bot to be disabled').setRequired(true))),


    //? Warning Commands
    new SlashCommandBuilder().setName('warn')
        .setDescription('Warn a user on the Network')
        .addUserOption(option => option.setName('user').setDescription('Target User').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true))
        .addIntegerOption(option => option.setName('violation').setDescription('Violation ID (Retrieve by using \`/violation fetch\`)').setRequired(true))
        .addIntegerOption(option => option.setName('rating').setDescription('Custom Violation Rating (1 Low-Risk | 10 High-Risk)').setRequired(false).setMinValue(0).setMaxValue(10)),


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
        ),


    //? System Commands
    new SlashCommandBuilder().setName('system')
        .setDescription('Generate System Statistic Screenshots')
        .addStringOption(option => option.setName('identification').setDescription('System Identification').setRequired(false))


].map(command => command.toJSON())



export async function Refresh() {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(
            Routes.applicationGuildCommands(Config.discord.client, Config.discord.guild),
            { body: commands },
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}