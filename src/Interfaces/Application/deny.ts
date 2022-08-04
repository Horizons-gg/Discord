import { Check } from '@lib/permissions'
import DenyApplication from '@lib/Modals/denyApplication'
import { Collections } from '@app/mongo'
import * as Discord from 'discord.js'


export async function main(interaction: Discord.ButtonInteraction) {

    //? Validate Permissions
    if (!await Check(interaction.user.id, ['Management']).catch(() => false)) return interaction.reply({ content: 'You do not have the required permissions to use this command!', ephemeral: true })


    //? Fetch Application
    const Application = await Collections.Applications.findOne({ message: interaction.message.id })


    //? Show Modal
    interaction.showModal(DenyApplication)
    
}