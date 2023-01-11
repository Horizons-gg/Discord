//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('edit')
    .setDescription('Edit a Position on the Database')

    .addStringOption(option => option
        .setName('title')
        .setDescription('The Title of the Position')
    )

    .addIntegerOption(option => option
        .setName('weight')
        .setDescription('The Weight Determines the Authority of the Position (Higher the Weight, Higher the Authority)')

        .setMinValue(1)
        .setMaxValue(1000)
    )

    .addRoleOption(option => option
        .setName('role1')
        .setDescription('Role to add to Users of this Position')
    )
    .addRoleOption(option => option
        .setName('role2')
        .setDescription('Role to add to Users of this Position')
    )
    .addRoleOption(option => option
        .setName('role3')
        .setDescription('Role to add to Users of this Position')
    )
    .addRoleOption(option => option
        .setName('role4')
        .setDescription('Role to add to Users of this Position')
    )
    .addRoleOption(option => option
        .setName('role5')
        .setDescription('Role to add to Users of this Position')
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    

}