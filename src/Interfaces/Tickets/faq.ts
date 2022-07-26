import Config from "@lib/config"
import { Collections } from "@app/mongo"


export async function main(interaction, flag) {

    //? Fetch Ticket
    const Ticket = await Collections.Tickets.findOne({ channel: interaction.channel.id })


    //? Prep FAQ
    const FAQ = Config.ticket.options[Ticket.designation][3]
    if (!FAQ) return


    //? Send FAQ Response
    interaction.reply(FAQ[interaction.values[0]].response)

}