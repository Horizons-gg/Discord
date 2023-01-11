//? Type Dependencies

import type { ObjectId } from "mongodb"
import type Discord from "discord.js"



//? Type Definitions

export { }

declare global {

    interface Ticket {
        _id: ObjectId

        state: 'open' | 'closed' | 'archived'
        
        owner: string
        channel: string
        controller: string

        details: {
            title: string
            service: string
            region: string
            description: string
        }

        log: {
            users: {
                id: string
                username: string
                discriminator: string
                avatar: string | null
            }[]

            messages: {
                id: string
                content: string
                author: string
                timestamp: Date
            }[]
        }

        created: Date
        closed: Date | null
    }

}