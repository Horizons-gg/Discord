import * as Bots from '@app/Bots'


export function main(interaction) {

    try {
        Bots[interaction.options._subcommand](interaction)
    } catch {
        interaction.reply({content: `Unknown Subcommand for Bots: "${interaction.options._subcommand}"`, ephemeral: true})
    }

}