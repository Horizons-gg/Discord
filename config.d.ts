export { }

declare global {

    interface Config {
        mongo: {
            uri: string
            db: string
        }

        discord: {
            token: string
            guild: string

            clickNcreate: string
            se_sandboxPath: string

            roles: {
                management: string
                staff: string
            }

            channels: {
                general: string
                landing: string
                mail: string
                logs: string
                forms: string
                archive: string
            }

            support: {
                support: string

                open: string
                closed: string

                services: {
                    id: string
                    name: string
                    role: string | null
                }[]
            }
        }

        bots: {
            name: string
            token: string
            method: 'system' | 'dayz' | 'mc'
            address: string
            enabled: boolean
        }[]
    }

}