// const Joi = require('joi')
const db = require('../dbOperations')
const {
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/index.utils')

// Login endpoint
exports.post = async (req, res) => {
    const { username, password } = req.body

    try {
        // Retrieve the user from the database
        const userDetails = await db.query(
            'SELECT * FROM dev.users WHERE is_active=true and (LOWER(username) = $1 OR LOWER(user_email) = $1 OR user_contact_number = $1)',
            [username.toLowerCase()]
        )

        if (userDetails.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' })
        }

        const login_details = await db.query(
            'SELECT * FROM dev.login_details where username = $1;',
            [userDetails.rows[0].username]
        )

        if (login_details.rows.length === 0) {
            return res.status(401).json({ error: 'Login details not found' })
        }

        if (
            await comparePassword(password, login_details.rows[0].password_hash)
        ) {
            const userTokenDetails = {
                id: userDetails.rows[0].user_id,
                username: userDetails.rows[0].username,
                isAdmin:
                    userDetails.rows[0].user_role?.toLowerCase() === 'admin',
            }
            const accessToken = generateAccessToken(userTokenDetails)
            const refreshToken = await generateRefreshToken(userTokenDetails)

            res.status(200).json({
                message: 'Login successful',
                accessToken,
                refreshToken,
            })
        } else {
            res.status(401).json({ message: 'Incorrect password' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error })
    }
}
