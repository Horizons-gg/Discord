import Config from "@lib/config"

import { Collections } from "@app/mongo"
import { Tickets } from "@interfaces/index"

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor, PermissionFlagsBits, TextChannel, SelectMenuBuilder } from "discord.js"



const Raw = Config.ticket.options

const Cancel = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Tickets-cancel')
            .setLabel('Cancel Ticket')
            .setStyle(ButtonStyle.Danger)
    )



export async function main(interaction) {

    //? Validate Selection
    let Regions: any
    const Designation = interaction.values[0]
    if (Raw[Designation][1] === '*') return await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { designation: Designation, region: 'All' } }), Tickets.open(interaction, null, true)
    if (!Raw[Designation][1].includes(',')) Regions = [Raw[Designation][1]]
    else Regions = Raw[Designation][1].split(',')


    //? Create Controls
    const Options = new ActionRowBuilder()
    Regions.forEach(region => {
        Options.addComponents(
            new ButtonBuilder()
                .setCustomId(`Tickets-region-${region}`)
                .setLabel(region)
                .setStyle(ButtonStyle.Primary)
        )
    })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: 'Select an Available Region',
            color: resolveColor("#3098d9"),
            author: {
                name: `${Raw[Designation][0]} - Support`
            }
        }], components: [Options, Cancel]
    })


    //? Update Ticket
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { designation: Designation } })

}