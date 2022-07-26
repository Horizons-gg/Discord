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
        options: any
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
}