//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Events from './events'


import * as Commands from '../../commands'



//? Client

let _client: Discord.Client

export default function (): Promise<Discord.Client> {
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
                    Commands.setup.command,
                    Commands.bot.command,

                    Commands.staff.command,

                    Commands.panel.command,
                    Commands.se.command,

                    Commands.support.command,

                ]).then(() => console.info('+ Successfully Registered Application Commands')).catch(err => console.error('- Failed to Register Application Commands!\n', err))

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

                    //? Slash Commands
                    if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {

                        if (interaction.commandName) path += interaction.commandName
                        if (interaction.options.getSubcommandGroup(false)) path += ('/' + interaction.options.getSubcommandGroup())
                        if (interaction.options.getSubcommand(false)) path += ('/' + interaction.options.getSubcommand())
                    }

                    if (interaction.isChatInputCommand()) require(path).response(interaction)
                    if (interaction.isAutocomplete()) require(path).autocomplete(interaction)


                    //? Interfaces
                    path = path = '../../interfaces/'

                    if (interaction.isButton()) require(`${path}buttons/${interaction.customId.includes('.') ? interaction.customId.split('.').join('/') : interaction.customId}`).default(interaction)
                    if (interaction.isAnySelectMenu()) require(`${path}menus/${interaction.customId.includes('.') ? interaction.customId.split('.').join('/') : interaction.customId}`).default(interaction)
                    if (interaction.isModalSubmit()) require(`${path}modals/${interaction.customId.includes('.') ? interaction.customId.split('.').join('/') : interaction.customId}`).default(interaction)

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