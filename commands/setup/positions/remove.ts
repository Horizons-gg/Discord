//? Dependencies

import { ObjectId } from 'mongodb'
import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import Positions from '@lib/discord/autocomplete/positions'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a Position from the Database')

    .addStringOption(option => option
        .setName('position')
        .setDescription('Position to be Removed from the Network')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    if (!ObjectId.isValid(interaction.options.getString('position', true))) return interaction.reply({ content: 'Invalid Position ID!', ephemeral: true })

    const Positions = await Collection('positions')
    Positions.deleteOne({ _id: new ObjectId(interaction.options.getString('position', true)) })

    interaction.reply({ content: `Position "${interaction.options.getString('position', true)}" has been Deleted!`, ephemeral: true })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await Positions(interaction.options.getFocused()))