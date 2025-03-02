const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    jwtSecretKey,
    jwtRefreshSecretKey,
} = require('../constants/index.constants')
const db = require('../dbOperations')

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 10)
    return hash
}

async function comparePassword(inputPassword, hashedPassword) {
    const match = await bcrypt.compare(inputPassword, hashedPassword)
    return match
}

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')?.[1]
    if (!accessToken) {
        return res.sendStatus(401) // Unauthorized
    }

    try {
        const user = verifyToken(accessToken, jwtSecretKey)
        req.user = user
        next()
    } catch (error) {
        return res.status(403).json({ error }) // Forbidden (token invalid or expired)
    }
}

// Middleware for authorization (example: admin access)
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.sendStatus(403) // Forbidden (user not authorized)
    }
}

// Function to generate access token
const generateAccessToken = (user) => {
    return jwt.sign(user, jwtSecretKey, {
        expiresIn: '2h',
    })
}

// Function to generate refresh token
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(user, jwtRefreshSecretKey)
    const hashedToken = await bcrypt.hash(refreshToken, 10)
    // Save the hashed refresh token in the database
    await db.query(
        'INSERT INTO dev.refresh_tokens (user_id, token) VALUES ($1, $2)',
        [user.id, hashedToken]
    )

    return refreshToken
}

module.exports = {
    hashPassword,
    comparePassword,
    authenticateUser,
    authorizeAdmin,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
}
