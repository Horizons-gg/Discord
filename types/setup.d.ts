//? Type Dependencies



//? Type Definitions

export { }

declare global {

    interface Support {
        _id: 'support'

        sections?: {
            opened: string
            closed: string
        }

        permissions?: {
            close: string[]
            open: string[]
            archive: string[]
            delete: string[]
            view: string[]
        }
    }

}