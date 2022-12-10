//? Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface StaffMember {

        _id: ObjectId

        id: string


        position: ObjectId | null

        availability: {
            isAvailable: boolean
            lastAvailable: Date

            isOnDuty: boolean
            lastOnDuty: Date

            unavailabilityReason: string | null
        } | null


    }

}