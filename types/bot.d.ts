//? Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface Bot {

        _id: ObjectId

        id: string
        token: string | null

        type: ('game' | 'server') | null
        tag: string | null

        enabled: boolean

        host: string | null
        method: ('valve' | 'arma3' | 'eco' | 'minecraft' | 'squad') | null

    }

}