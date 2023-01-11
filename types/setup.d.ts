//? Type Dependencies



//? Type Definitions

export { }

declare global {

    interface Support {
        _id: 'support'

        
        onDutyRole: string

        sections: {
            opened: string
            closed: string
        }

        permissions: {
            close: string[]
            open: string[]
            archive: string[]
            delete: string[]
            view: string[]
        }
    }


    interface StaffSetup {
        _id: 'staff'

        
        onLeaveRole: string

        positions: {
            title: string
            description: string
            weight: number

            roles: string[]
        }[]
    }

}