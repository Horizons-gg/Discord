import * as Discord from 'discord.js'
import panels from '@lib/panels'



export async function main(interaction) {
    
    const Panel = panels(interaction.options._hoistedOptions[0].value)
    if (!Panel) return interaction.reply({ content: 'Panel not found!', ephemeral: true })

    interaction.channel.send(Panel)
    interaction.reply({ content: 'Panel sent!', ephemeral: true })

}