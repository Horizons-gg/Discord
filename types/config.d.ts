//? Type Definitions

export { }

declare global {

    interface Config {
        port: number

        mongo: {
            uri: string
            db: string
        }

        discord: {
            client: string
            token: string
            guild: string
        }
    }

}