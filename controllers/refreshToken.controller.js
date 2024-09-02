const db = require('../dbOperations')
const {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} = require('../utils/index.utils')
const { jwtRefreshSecretKey } = require('../constants/index.constants')
// Login endpoint

// Refresh token route (POST)
exports.post = async (req, res) => {
    const refreshToken = req.body.refreshToken

    const decodedToken = verifyToken(refreshToken, jwtRefreshSecretKey)
    const userId = decodedToken.id
    console.log('user id', userId)
    try {
        // Check if the refresh token exists in the database
        const token = await db.query(
            'SELECT * FROM dev.refresh_tokens WHERE user_id = $1',
            [userId]
        )
        if (token.rows.length === 0) {
            return res.status(403).json({ error: 'Invalid refresh token' })
        }
        // Verify the refresh token
        if (await comparePassword(refreshToken, token.rows[0].token)) {
            console.log('query', 'ref')
            // Retrieve the user from the database
            const userDetails = await db.query(
                'SELECT * FROM dev.users WHERE is_active=true and user_id = $1',
                [userId]
            )
            console.log('userDetails', userDetails.rows)
            const userTokenDetails = {
                id: userDetails.rows[0].user_id,
                username: userDetails.rows[0].username,
                isAdmin:
                    userDetails.rows[0].user_role?.toLowerCase() === 'admin',
            }
            const accessToken = generateAccessToken(userTokenDetails)
            const newRefreshToken = await generateRefreshToken(userTokenDetails)

            // Send the new tokens in the response
            res.json({ accessToken, refreshToken: newRefreshToken })
        } else {
            res.status(403).json({ error: 'Invalid refresh token' })
        }
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            errorMessagae: error,
        })
    }
}
