import * as Discord from 'discord.js'


export function main(interaction: Discord.ModalSubmitInteraction) {
    
    const Fields = interaction.fields

    const Name = Fields.getTextInputValue('application.name')
    const Experience = Fields.getTextInputValue('application.experience')
    const Statement =  Fields.getTextInputValue('application.statement')
    const Position = Fields.getTextInputValue('application.position')
    const Region = Fields.getTextInputValue('application.region')


    console.log(Name, Experience, Statement, Position, Region)

}