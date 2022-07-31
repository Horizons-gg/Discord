import { DisableBot } from '@app/discord'
import { Collections } from '@app/mongo'
import * as Discord from 'discord.js'


export async function main(interaction) {

    const User: Discord.User = interaction.options._hoistedOptions[0].user
    if (!User.bot) interaction.reply({ content: `<@${User.id}> is not a bot!`, ephemeral: true })

    const DBCheck = await Collections.Bots.findOne({ id: User.id })
    if (!DBCheck) return interaction.reply({ content: `<@${User.id}> is not on the database!`, ephemeral: true })

    DisableBot(User.id)
        .then(() => interaction.reply({ content: `<@${User.id}> has been successfully disabled on the network!`, ephemeral: true }))
        .catch(error => interaction.reply({ content: error, ephemeral: true }))

}