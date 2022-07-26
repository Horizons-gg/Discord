import Config from '@lib/config'



export let TicketsConfig = []
for (const opt in Config.ticket.options) {
    TicketsConfig.push({
        value: opt,
        label: Config.ticket.options[opt][0]
    })
}


// export let RolesConfig = []
// for (const opt in process.env.roles.options) {
//     process.env.roles.raw.push({
//         value: opt,
//         label: process.env.roles.options[opt][0],
//         description: process.env.roles.options[opt][1]
//     })
// }