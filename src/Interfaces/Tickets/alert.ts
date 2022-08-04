import Config from '@lib/config'
import { Client } from '@app/discord'
import { Collections } from '@app/mongo'

import { tickets as Tickets } from '@interfaces/index'



export async function main(interaction, flag) {

    //? Prerequisites
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)


    //? Update Ticket
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { region: flag[2] } })


    //? Finalize Ticket
    Tickets.open(interaction, flag, true)

}