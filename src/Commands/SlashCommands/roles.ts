import * as Roles from '@app/Roles'


export function main(interaction) {

    try {
        Roles[interaction.options._subcommand](interaction)
    } catch {
        interaction.reply({content: `Unknown Subcommand for Roles: "${interaction.options._subcommand}"`, ephemeral: true})
    }

}