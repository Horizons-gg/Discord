//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'
import { Messages } from '@lib/discord'



//? Method

export default function (channel: string, user: string, interaction: Discord.CommandInteraction | Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction | Discord.AnySelectMenuInteraction): Promise<string> {
    return new Promise(async (resolve, reject) => {

        const Tickets = await Collection('tickets')

        const Ticket = await Tickets.findOne({ channel: channel }) as Ticket
        if (!Ticket) return reject('Ticket does not exist.')


        const User = await GetUser(user) as Discord.GuildMember & Discord.User

        if (User.bot) return Messages.responseError('Bots cannot be added to tickets', interaction, 'Failed to Add User to Ticket')
        if (User.id == Ticket.owner) return Messages.responseError('The ticket owner already has access to this ticket', interaction, 'Failed to Add User to Ticket')


        const Channel = interaction.channel as Discord.TextChannel
        Channel.permissionOverwrites.create(User.id, { ViewChannel: true })
            .then(() => Messages.responseStandard(`${User} has been added to the ticket!`, interaction, 'User Added to Ticket'))

    })
}