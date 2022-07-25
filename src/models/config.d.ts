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
}