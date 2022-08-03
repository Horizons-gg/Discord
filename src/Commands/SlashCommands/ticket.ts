import * as Tickets from '@app/Tickets'


export function main(interaction) {

    try {
        Tickets[interaction.options._subcommand](interaction)
    } catch {
        interaction.reply({content: `Unknown Subcommand for Tickets: "${interaction.options._subcommand}"`, ephemeral: true})
    }

}