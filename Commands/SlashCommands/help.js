module.exports = interaction => {

    interaction.reply({
        embeds: [{
            "title": "Horizons | Help",
            "description": `
            
            Here's a list of commands you can use in Horizons and a few tips and tricks too!

            **/se** - Replies with Space Engineers Server Connections.
            **/ticket** - Ticket Commands.
            `
        }],
        ephemeral: true
    })

}