import Config from "@lib/config"
import { client as Client } from "@app/discord"
import { resolveColor } from "discord.js"

export function main(member) {

    //? Guild Check
    if (member.guild.id !== Config.discord.guild) return


    //? Prerequisites
    const Guild: any = Client.guilds.cache.get(Config.discord.guild)


    //? Landing Pad Notification
    Guild.channels.cache.find(channel => channel.name === "🪂landing-pad").send({
        embeds: [{
            color: resolveColor('#f51b1b'),
            description: `${member.user.tag} left the server`
        }]
    })

}