// External Dependencies
import * as fs from 'fs'
import { Config as Model } from '@models/config'

const Config: Model = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

export default Config



export let TicketsConfig = []
for (const opt in Config.ticket.options) {
    TicketsConfig.push({
        value: opt,
        label: Config.ticket.options[opt][0]
    })
}

export let RolesConfig = []
for (const opt in Config.roles.options) {
    RolesConfig.push({
        value: opt,
        label: Config.roles.options[opt][0],
        description: Config.roles.options[opt][1]
    })
}