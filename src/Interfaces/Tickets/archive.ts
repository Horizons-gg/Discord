import Config from '@lib/config'
import { Collections } from '@app/mongo'
import { Check } from '@lib/permissions'



export function main(interaction) {

    //? Check Permissions
    
    Check(interaction.user, Config.ticket.permissions.archive)
        .then(() => {
            Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'archived' } })
            interaction.channel.delete()
        })
        .catch(() => interaction.reply({ content: 'You do not have permission to archive tickets.', ephemeral: true }))

}