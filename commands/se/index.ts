//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('se')
    .setDescription('Connection Information for our Space Engineers Servers')
    .setDMPermission(true)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    interaction.reply({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('Space Engineers | Network')
                .setDescription('The following addresses and protocols are used to connect to the Space Engineers Servers.')
                .setFields(
                    { name: "Oceania", value: `Auto Join: steam://connect/103.193.80.40:27015\nDirect Connect: \`103.193.80.40:27016\`` },
                    // { name: "United States", value: `Auto Join: steam://connect/51.81.167.112:27015\nDirect Connect: \`51.81.167.112:27015\`` },
                    // { name: "Europe", value: `Auto Join: steam://connect/144.76.68.205:27015\nDirect Connect: \`144.76.68.205:27015\`` }
                )
                .setImage('https://invisioncommunity.co.uk/wp-content/uploads/2021/05/space-engineers.jpg')
                .setFooter({ text: 'Game must be closed to use Auto Join!' })
        ],
        ephemeral: true
    })
}