import Config from '@lib/config'
import { Check } from '@lib/permissions'
import { Client } from '@app/discord'
import { Collections } from '@app/mongo'
import { Accepted } from '@lib/Interfaces/applicationReview'
import * as Discord from 'discord.js'


export async function main(interaction: Discord.ButtonInteraction) {

    //? Validate Permissions
    if (!await Check(interaction.user.id, ['Management']).catch(() => false)) return interaction.reply({ content: 'You do not have the required permissions to use this command!', ephemeral: true })


    //? Fetch Application
    const Application = await Collections.Applications.findOne({ message: interaction.message.id })


    //? Prepare Users
    const Guild: Discord.Guild = Client.guilds.cache.get(Config.discord.guild)
    const Recruit = await Guild.members.fetch(Application.user.id)
    const Manager = await Guild.members.fetch(interaction.user.id)


    //? Prepare Form
    const Channel: any = Guild.channels.cache.find(channel => channel.name === '📰forms')
    const Form = await Channel.messages.fetch(Application.message)


    //? Send Requests
    Form.edit(Accepted(Application, Recruit, Application._id.toString(), Manager))

    Recruit.send(`Congratulations! Your Application has been Accepted by <@${Manager.id}>!\n\nYou can talk to our Interviewers in ${Guild.channels.cache.find(channel => channel.name === '⌚interview-chat')} and ${Guild.channels.cache.find(channel => channel.name === '💿Interview Voice')}`)
        .then(() => interaction.reply({ content: `<@${Recruit.id}> has been send a DM informing them of their applications approval!`, ephemeral: true }))
        .catch(err => interaction.reply({ content: `<@${Recruit.id}> does not have DM's enabled in their Privacy Settings, they were unable to receive their acceptance message, please use another method to communicate their application status with them!`, ephemeral: true }))

    Recruit.roles.add(Guild.roles.cache.find(role => role.name === 'Awaiting Interview')).catch(err => `Failed to Add "Awaiting Interview" Role to ${Recruit.user.tag}`)

    Collections.Applications.updateOne({ _id: Application._id }, { $set: { status: 'accepted' } })
}