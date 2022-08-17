import * as Discord from 'discord.js'



export function main(interaction: Discord.CommandInteraction) {
    interaction.reply('Rolling Dice...')

    setTimeout(rolldice.bind(null, interaction), 3000)
}


function rolldice(interaction: any) {

    
    const outcome = Math.floor(Math.random() * interaction.options.getInteger('sides')ty) + 1

    interaction.editReply(`The Dice has Landed on ${outcome}`)

}