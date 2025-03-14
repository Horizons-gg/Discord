export { }

declare global {

    interface Ticket {
        owner?: string
        designation?: string
        state?: 'open' | 'closed' | 'pending'
        priority?: 'low' | 'high'
        created?: number
        notify?: number
        members?: string[]
    }
    
}