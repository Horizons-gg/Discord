//? Dependencies

import Discord from 'discord.js'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    console.log(interaction.fields.getTextInputValue('daniel'))

    interaction.reply('DANIEL GAE')

}