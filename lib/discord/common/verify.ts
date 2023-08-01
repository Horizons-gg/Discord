//? Dependencies

import * as Discord from 'discord.js'



//? Globals

const Sessions: {
    id: string
    key: string
    timer: NodeJS.Timeout
}[] = []



//? Method

export function initialize(user: Discord.GuildMember): Promise<string> {
    return new Promise((resolve, reject) => {

        const Key = Math.random().toString(36).substring(2, 15)

        if (Sessions.find(session => session.id === user.id)) return reject('Session Already Exists!')

        Sessions.push({
            id: user.id,
            key: Key,
            timer: setTimeout(() => {
                const index = Sessions.findIndex(session => session.id === user.id)
                user.kick('Failed to Verify Account Age').catch(() => {})
                Sessions.splice(index, 1)
            }, 1000 * 60 * 15)
        })

        return resolve(Key)

    })
}


export function attempt(user: string, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const Session = Sessions.find(session => session.id === user)

        if (!Session) return reject('NO_SESSION')
        if (Session.key !== key) return reject('INVALID_KEY')

        clearTimeout(Session.timer)
        Sessions.splice(Sessions.indexOf(Session), 1)

        return resolve(true)

    })
}