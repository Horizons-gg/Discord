//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Events from './events'


import * as Commands from '../../commands'



//? Client

let _client: Discord.Client

export function Client(): Promise<Discord.Client> {
    return new Promise((resolve, reject) => {

        if (!_client?.isReady()) {
            _client = new Discord.Client({
                intents: [
                    Discord.GatewayIntentBits.Guilds,
                    Discord.GatewayIntentBits.GuildMembers,
                    Discord.GatewayIntentBits.GuildMessages
                ]
            })

            _client.login(Config.discord.token).catch(reject)

            _client.on('ready', () => {
                console.log(`Logged in as ${_client.user?.tag || '"Unknown"'}`)
                if (_client.user) resolve(_client)
                else reject('Client is not ready!')


                //! Register Commands

                if (_client.application) _client.application.commands.set([
                    Commands.bot.command
                ])

                // const Guild = _client.guilds.cache.get(Config.discord.guild)
                // Guild?.commands.set([])

            })



            //! Events

            _client.on('guildMemberAdd', Events.guildMemberAdd)
            _client.on('guildMemberRemove', Events.guildMemberRemove)



            //! Interaction Handling

            _client.on('interactionCreate', interaction => {

                let path = '../../commands/'

                try {

                    if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
                        if (interaction.commandName) path += interaction.commandName
                        if (interaction.options.getSubcommandGroup()) path += ('/' + interaction.options.getSubcommandGroup())
                        if (interaction.options.getSubcommand()) path += ('/' + interaction.options.getSubcommand())
                    }

                    if (interaction.isChatInputCommand()) require(path).response(interaction)
                    if (interaction.isAutocomplete()) require(path).autocomplete(interaction)
                    // if (interaction.isButton()) Buttons[interaction.customId.split('.')[0]](interaction, interaction.customId.split('.'))

                } catch (err) {

                    console.error(err)

                    if (interaction.isAutocomplete()) interaction.respond([{ name: `${path} is missing an autocomplete method!`, value: '.' }])
                    if (interaction.isChatInputCommand() || interaction.isButton()) interaction.reply({ content: 'This Command does not exist on the Server!', ephemeral: true })
                    else console.log(`Interaction "${interaction.id}" does not exist on the Server!`)

                }

            })


        } else resolve(_client)

    })
}

export default Client



//? Common Functions

export function Guild(): Promise<Discord.Guild> {
    return new Promise((resolve, reject) => {

        Client().then(async client => {
            const Guild = client.guilds.cache.get(Config.discord.guild) || await client.guilds.fetch(Config.discord.guild)
            if (Guild) resolve(Guild)
            else reject('Failed to Fetch Guild!')
        }).catch(reject)

    })
}

export function User(id: string): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {

        Guild().then(async guild => {
            const User = guild.members.cache.get(id) || await guild.members.fetch(id)
            if (User) resolve(User)
            else reject('Failed to Fetch User!')
        }).catch(reject)

    })
}