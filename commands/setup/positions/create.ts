//? Dependencies

import {ObjectId} from 'mongodb'
import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Add a New Position to the Database (Upto 5 Roles per Position)')

    .addStringOption(option => option
        .setName('title')
        .setDescription('The Title of the Position')
        .setRequired(true)
    )

    .addIntegerOption(option => option
        .setName('weight')
        .setDescription('The Weight Determines the Authority of the Position (Higher the Weight, Higher the Authority)')
        .setRequired(true)

        .setMinValue(1)
        .setMaxValue(1000)
    )

    .addRoleOption(option => option
        .setName('role1')
        .setDescription('Role to add to Users of this Position')
        .setRequired(true)
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

    const Positions = await Collection('positions')

    let Position: Position = {
        _id: new ObjectId(),
        title: interaction.options.getString('title', true),
        weight: interaction.options.getInteger('weight', true),
        roles: []
    };

    ['role1', 'role2', 'role3', 'role4', 'role5'].forEach(name => {
        const role = interaction.options.getRole(name)
        if (role) Position['roles'].push(role.id)
    })


    Positions.insertOne(Position)
        .then(res => interaction.reply({ content: `>>> __**Position "${Position.title}" has been successfully Created!**__\n**GUID:** \`${res.insertedId}\`\n**Weight:** \`${Position.weight}\`\n\n**Roles:** ${Position.roles.map((role: string) => `<@&${role}>`).join(', ')}`, ephemeral: true }))
        .catch(err => interaction.reply({ content: `\`\`\`${err}\`\`\``, ephemeral: true }))

}