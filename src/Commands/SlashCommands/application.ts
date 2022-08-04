import * as Applications from '@app/Applications'


export function main(interaction) {

    try {
        Applications[interaction.options._subcommand](interaction)
    } catch (err) {
        console.log(err)
        interaction.reply({content: `Unknown Subcommand for Applications: "${interaction.options._subcommand}"`, ephemeral: true})
    }

}