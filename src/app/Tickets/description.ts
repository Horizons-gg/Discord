import Config from "@lib/config"
import { Check as ValidatePermissions } from "@lib/permissions"
import { Collections } from "@app/mongo"
import { TextChannel } from "discord.js"

export async function main(interaction) {

    //? Check if channel is a ticket
    if (![Config.ticket.open, Config.ticket.closed].includes(interaction.channel.parentId)) return interaction.reply({ content: 'You can only use this command in a ticket!', ephemeral: true })


    //? Prerequisites
    const User = interaction.user
    const Channel: TextChannel = interaction.channel
    const Description = interaction.options._hoistedOptions[0].value


    //? Validate Users Permissions
    const Validation = await ValidatePermissions(User.id, ['Staff']).then(() => true).catch(() => false)
    if (!Validation) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true })


    //? Update Ticket
    Collections.Tickets.updateOne({ channel: interaction.channel.id }, { $set: { description: Description } })

    interaction.reply({ embeds: [{ "description": `<@${User.id}> has Updated the Description of this Ticket to: \`\`\`${Description}\`\`\`` }] })
    
    Channel.setTopic(Description)

}