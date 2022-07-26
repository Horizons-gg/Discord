import * as Discord from 'discord.js'



export function main(interaction) {
    interaction.reply({
        embeds: [{
            title: "Space Engineers | Network",
            description: "The following addresses and protocols are used to connect to the Space Engineers Servers.",
            fields: [
                { name: "Oceania", value: `Auto Join: steam://connect/103.193.80.40:27015\nDirect Connect: \`103.193.80.40:27015\`` },
                { name: "United States", value: `Auto Join: steam://connect/51.81.167.112:27015\nDirect Connect: \`51.81.167.112:27015\`` },
                { name: "Europe", value: `Auto Join: steam://connect/144.76.68.205:27015\nDirect Connect: \`144.76.68.205:27015\`` }
            ],
            image: {
                url: "https://invisioncommunity.co.uk/wp-content/uploads/2021/05/space-engineers.jpg"
            },
            footer: {
                text: "Game must be closed to use Auto Join!"
            }
        }],
        ephemeral: true
    })
}