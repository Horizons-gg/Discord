export interface Config {
    port: number

    mongo: {
        host: string
        database: string
    }
    
    discord: {
        client: string
        token: string
        guild: string
    }

    roles: {
        options: object
    }

    ticket: {
        open: string
        closed: string
        display: {
            channel: string
            message: string
        }
        options: object
        permissions: {
            archive: [string]
            delete: [string]
        }
    }

    application: {
        role: string
        options: object
    }

    servers: object
    games: object
}