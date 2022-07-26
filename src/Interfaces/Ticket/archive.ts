import Config from '@lib/config'
import { Collections } from '@app/mongo'
import { Check } from '@lib/permissions'



export async function main(interaction) {

    //? Check Permissions
    if (!await Check(interaction.user, Config.ticket.permissions.archive)) return interaction.reply({ content: 'You do not have permission to archive tickets.', ephemeral: true })


    //? Archive Ticket
    await Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'archived' } })
    interaction.channel.delete()

}