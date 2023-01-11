//? Dependencies

import Discord from 'discord.js'

import Payload from '@lib/templates/embeds/support'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('panel')
    .setDescription('Sends the Support Panel into the Current Channel')

    .addBooleanOption(option => option
        .setName('detached')
        .setDescription('Whether the Panel should be seen as a reply or not')
    )



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

    if (interaction.options.getBoolean('detached')) interaction.channel?.send(Payload()), interaction.deferReply().then(() => interaction.deleteReply())
    else interaction.reply(Payload())

}