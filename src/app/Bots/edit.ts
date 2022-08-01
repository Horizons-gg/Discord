import { DisableBot } from '@app/discord'
import { Collections } from '@app/mongo'
import { ValidateClient } from '@lib/discord'
import * as Discord from 'discord.js'


export async function main(interaction) {

    const User: Discord.User = interaction.options._hoistedOptions[0].user
    if (!User.bot) interaction.reply({ content: `<@${User.id}> is not a bot!`, ephemeral: true })


    //? Check that the Bot is in the Database
    const DBCheck = await Collections.Bots.findOne({ id: User.id })
    if (!DBCheck) return interaction.reply({ content: `<@${User.id}> is not on the database!`, ephemeral: true })


    //? Cycle through each edit option
    const Update = {}

    await interaction.options._hoistedOptions.forEach(async option => {

        if (option.name === 'token') ValidateClient(User.id, option.value)
            .then(() => Update['token'] = option.value)
            .catch(error => console.log(error))

        if (option.name === 'tag') {
            if (/^[a-zA-Z0-9_]+$/.test(option.value)) if (!await Collections.Bots.findOne({ tag: option.value.toLowerCase() })) Update['tag'] = option.value.toLowerCase()
        }

        if (option.name === 'host') Update['host'] = option.value

        if (option.name === 'method') Update['method'] = option.value

    })

    Collections.Bots.updateOne({ id: User.id }, { $set: Update })
        .then(() => interaction.reply({ content: `<@${User.id}> was successfully updated!`, ephemeral: true }))
        .catch(error => {
            interaction.reply({ content: `An Error Occurred while attempting to edit <@${User.id}> on the database!\nPlease read the console logs for more information on the error.`, ephemeral: true })
            console.log(error)
        })

    DisableBot(User.id).catch(error => console.log(error))
}