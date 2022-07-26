import Config from "@lib/config"
import { Client } from "@app/discord"



export async function main(interaction, flag) {

    //? Prerequisites
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)


    //? Add Roles
    for (const opt in Config.roles.options) {
        Guild.roles.cache.forEach(role => {
            if (role.name === Config.roles.options[opt][2] && opt === flag[2]) User.roles.add(role).catch(() => 'Failed to update user roles.'), interaction.reply({ content: `You have been added to the \`${Config.roles.options[opt][0]}\` role and will now receive notifications!`, ephemeral: true })
        })
    }

}