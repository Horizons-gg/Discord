const fs = require('fs')

module.exports = interaction => {

    if (!interaction.options._subcommand) return
    if (fs.existsSync(`./Commands/SlashCommands/Level/${interaction.options._subcommand}.js`)) require(`./Level/${interaction.options._subcommand}.js`)(interaction)

}