import { Collections } from "@app/mongo"
import { Tickets } from "@interfaces/index"



export async function main(interaction, flag) {

    //? Update Ticket
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { region: flag[2] } })


    //? Finalize Ticket
    Tickets.open(interaction, flag, true)

}