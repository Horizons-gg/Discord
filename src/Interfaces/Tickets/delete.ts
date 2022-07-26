import Config from '@lib/config'
import { Collections } from '@app/mongo'
import { Check } from '@lib/permissions'


export function main(interaction) {

    //? Check Permissions
    Check(interaction.user, Config.ticket.permissions.delete)
        .then(() => {
            Collections.Tickets.deleteOne({ channel: interaction.channel.id })
            interaction.channel.delete()
        })
        .catch(() => interaction.reply({ content: 'You do not have permission to delete tickets.', ephemeral: true }))

}