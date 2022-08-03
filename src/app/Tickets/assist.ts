import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor } from "discord.js"



const Row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Tickets-create')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Success)
    )


export function main(interaction) {
    interaction.reply({
        embeds: [{
            title: "<:support:845624848466182164> **Horizons Community Support**",
            description: ">>> The Horizons Staff Team will help you with any issues you may be having.\nMake sure to explain your issue to us and if you want, you can even add other members to the ticket!",
            color: resolveColor("#3ba55d"),
            thumbnail: {
                url: 'https://i.imgur.com/MVGVVBr.png',
            }
        }],
        components: [Row]
    })
}