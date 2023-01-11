//? Type Dependencies

import type { ObjectId } from "mongodb"
import type Discord from "discord.js"



//? Type Definitions

export { }

declare global {

    interface Ticket {
        _id: ObjectId

        state: 'open' | 'closed'
        
        owner: string
        channel: string

        details: {
            title: string
            service: string
            description: string
        }

        log: {
            users: {
                id: string
                username: string
                discriminator: string
                avatar: string
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