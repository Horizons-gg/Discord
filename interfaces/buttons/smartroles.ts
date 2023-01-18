//? Dependencies

import Discord from 'discord.js'

import { dbUser, Messages } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    const User = await dbUser.Fetch(interaction.user.id)
    const Option = interaction.customId.split('-')[1]

    User.optIn = Option == 'optin' ? true : false

    dbUser.Update(User.id, User)
        .then(() => Messages.responseStandard(`You have successfully opt-${User.optIn ? 'in for' : 'out of'} Smart Roles.`, interaction, 'Smart Roles', false, User.optIn ? 'success' : 'secondary'))
        .catch(() => Messages.responseError(`There was an error updating your Smart Roles preferences.`, interaction, 'Error | Smart Roles'))

}