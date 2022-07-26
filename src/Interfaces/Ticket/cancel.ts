import { Collections } from "@app/mongo"



export async function main(interaction) {

    //? Delete Ticket
    await Collections.Tickets.deleteOne({ channel: interaction.channel.id })
    await interaction.channel.delete()

}