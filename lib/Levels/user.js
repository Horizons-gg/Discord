const Users = process.db.collection('levels')

class Account {
    constructor(id) {
        this._id = id
        this.notify = true
        
        this.xp = 0
        this.level = 1

        Users.insertOne(this).catch(err => console.log(err))
    }
}



var User = {}


User.fetch = async function (id) {
    return await Users.findOne({ _id: id }).then(data => !data ? new Account(id) : data)
}
User.update = async function (user) {
    return await Users.updateOne({ _id: user._id }, { $set: user }).catch(err => console.log(err))
}

User.addXP = async function (id, xp) {
    return this.fetch(id).then(user => {
        user.xp += xp

        const NextLevel = Math.floor(Math.pow(user.level, 1.1) * 40)
        console.log(NextLevel)
        if (user.xp >= NextLevel) user.level++, user.xp = 0

        this.update(user)
        return user
    })
}
User.subXP = async function (id, xp) {
    return this.fetch(id).then(user => {
        user.xp -= xp
        this.update(user)
        return user
    })
}
User.setXP = async function (id, xp) {
    return this.fetch(id).then(user => {
        user.xp = xp
        this.update(user)
        return user
    })
}

User.addLevel = async function (id, level) {
    return this.fetch(id).then(user => {
        user.level += level
        this.update(user)
        return user
    })
}
User.subLevel = async function (id, level) {
    return this.fetch(id).then(user => {
        user.level -= level
        this.update(user)
        return user
    })
}
User.setLevel = async function (id, level) {
    return this.fetch(id).then(user => {
        user.level = level
        this.update(user)
        return user
    })
}






module.exports = {
    User
}