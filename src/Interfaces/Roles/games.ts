import Config from "@lib/config"
import { Client } from "@app/discord"



export async function main(interaction) {

    //? Prerequisites
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)


    //? Remove Roles
    for (const opt in Config.roles.options) {
        Guild.roles.cache.forEach(role => {
            if (role.name === Config.roles.options[opt][2] && !interaction.values.includes(opt)) User.roles.remove(role)
        })
    }


    //? Add Roles
    for (const opt in Config.roles.options) {
        Guild.roles.cache.forEach(role => {
            if (role.name === Config.roles.options[opt][2] && interaction.values.includes(opt)) User.roles.add(role)
        })
    }

    interaction.reply({ content: 'Your game roles have been updated!', ephemeral: true })

}