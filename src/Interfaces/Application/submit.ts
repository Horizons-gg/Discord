import Config from '@lib/config'
import { Pending } from '@lib/Interfaces/applicationReview'
import { Collections } from '@app/mongo'
import { Client } from '@app/discord'
import * as Discord from 'discord.js'


export async function main(interaction: Discord.ModalSubmitInteraction) {

    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)

    const PrevApp = await Collections.Applications.findOne({ "user.id": User.id })
    if (PrevApp) if (PrevApp.status === 'pending') return interaction.reply({ content: 'You already have a pending application!', ephemeral: true })


    const Fields = interaction.fields

    const Application = {
        user: interaction.user,
        status: 'pending',
        created: new Date(),

        name: Fields.getTextInputValue('application.field.name'),
        position: Fields.getTextInputValue('application.field.position'),
        region: Fields.getTextInputValue('application.field.region'),
        experience: Fields.getTextInputValue('application.field.experience'),
        statement: Fields.getTextInputValue('application.field.statement')
    }

    Collections.Applications.insertOne(Application)
        .then(res => {
            const Channel: any = Guild.channels.cache.find(channel => channel.name === '📰forms')

            Channel.send(Pending(Application, User, res.insertedId.toString()))
                .then(msg => Collections.Applications.updateOne({ _id: res.insertedId }, { $set: { message: msg.id } }))

            interaction.reply({ content: `Your Application has been Submitted!\nWe'll get back to you as soon as we can, make sure that you have enabled DM's from Server Members in this Servers Privacy Settings!\n\n>>> **Application UID:** \`${res.insertedId.toString()}\``, ephemeral: true })
        })
        .catch(err => {
            console.log(err)
            interaction.reply({ content: `An error occurred while processing your application, please contact an administrator and provide the following error log.\n\n\`\`\`js\n${err}\`\`\``, ephemeral: true })
        })


}