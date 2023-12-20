const bcrypt = require('bcrypt')

async function hashPassword(password) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

async function comparePassword(inputPassword, hashedPassword) {
    const match = await bcrypt.compare(inputPassword, hashedPassword)
    return match
}

module.exports = {
    hashPassword,
    comparePassword,
}
