import Config from '@lib/config'
import { Collections } from '@app/mongo'
import { Check } from '@lib/permissions'


export async function main(interaction) {

    //? Check Permissions
    if (!await Check(interaction.user, Config.ticket.permissions.delete)) return interaction.reply({ content: 'You do not have permission to delete tickets.', ephemeral: true })


    //? Delete Ticket
    await Collections.Tickets.deleteOne({ channel: interaction.channel.id })
    await interaction.channel.delete()

}