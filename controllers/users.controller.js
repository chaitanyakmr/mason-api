const Joi = require('joi')
const db = require('../dbOperations')
const passwordUtils = require('../utils/index.utils')
const logger = require('../logger')
// const User = db.users;

function validateUser(user) {
    const JoiSchema = Joi.object({
        user_firstname: Joi.string().min(1).max(50).required(),
        user_lastname: Joi.string().min(1).max(50).required(),
        user_dob: Joi.date().required(),
        user_contact_number: Joi.string().min(1).max(50).required(),
        user_email: Joi.string().min(3).max(300).required().email(),
        username: Joi.string().min(1).max(50).required(),
        user_role: Joi.string().min(1).max(50).optional(),
        password: Joi.string().min(6).max(50).optional(),
    }).options({ abortEarly: false })

    return JoiSchema.validate(user)
}

// Retrieve all User from the database.
exports.get = (req, res) => {
    db.query('select * from dev.users where is_active=true')
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            const errorObj = {
                message: 'Some error occurred while retrieving Users.',
                details: err,
            }
            logger.error(errorObj)
            res.status(500).send(errorObj)
        })
}

// Find a single User with an id
exports.getById = (req, res) => {
    const user_id = req.params.id
    db.query(`select * from dev.users where user_id=$1 and is_active=true`, [
        user_id,
    ])
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            const errorObj = {
                message: 'Error retrieving User with id=' + user_id,
                details: err,
            }
            logger.error(errorObj)
            res.status(500).send(errorObj)
        })
}

// Create and Save a new User
exports.post = async (req, res) => {
    const user = req.body
    const validUser = validateUser(user)
    if (validUser.error) {
        res.status(400).send({
            message: validUser.error,
        })
        return
    }
    try {
        await db.query('BEGIN') // Start the transaction

        // Encrypt the password
        const hashedPassword = await passwordUtils.hashPassword(user.password)
        // Save User in the database/
        const { rows } = await db.query(
            `INSERT INTO dev.users (user_firstname, user_lastname, user_contact_number, user_email, username, user_dob)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
            [
                user.user_firstname,
                user.user_lastname,
                user.user_contact_number,
                user.user_email,
                user.username,
                user.user_dob,
            ]
        )

        const user_id = rows[0].user_id
        // Store the user in the database
        await db.query(
            'INSERT INTO dev.login_details (username, password_hash) VALUES ($1, $2)',
            [rows[0].username, hashedPassword]
        )

        const roles = await db.query(
            'SELECT * from dev.role where LOWER(role_name)=LOWER($1)',
            [user.user_role]
        )

        await db.query(
            `INSERT INTO dev.user_role ( user_id, role_id)
             VALUES ($1, $2)`,
            [user_id, roles.rows[0].role_id]
        )

        await db.query('COMMIT') // Commit the transaction

        res.status(201).json(rows[0])
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        const errorObj = {
            details: { err },
        }
        logger.error(errorObj)
        res.status(500).json({ error: errorObj })
    } finally {
        // db.release(); // Release the connection back to the pool
    }
}

// Update a User by the id in the request
exports.put = (req, res) => {
    const id = req.params.id
    const validUser = validateUser(req.body)
    if (validUser.error) {
        res.status(400).send({
            message: validUser.error,
        })
        return
    }
    db.query(
        `UPDATE dev.users SET user_firstname=$1, user_lastname=$2, user_contact_number=$3, user_email=$4, username=$5, user_dob=$6 ,modified_date=$7 where user_id=$8
     RETURNING *`,
        [
            req.body.user_firstname,
            req.body.user_lastname,
            req.body.user_contact_number,
            req.body.user_email,
            req.body.username,
            req.body.user_dob,
            new Date().toUTCString(),
            id,
        ]
    )
        .then((data) => {
            if (data.rows.length > 0) {
                res.send({
                    message: 'User was updated successfully.',
                })
            } else {
                res.status(400).send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating User with id=' + id,
                details: err,
            })
        })
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id
    db.query(
        'update dev.users set is_active=false where user_id=$1 RETURNING *',
        [id]
    )
        .then((data) => {
            if (data?.rows?.length > 0) {
                res.send({
                    message: `User with the user_id ${data.rows.user_id} deleted successfully`,
                })
            } else {
                res.status(400).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                })
            }
            res.status(200).send(
                `User with the user_id ${data.rows.user_id} deleted successfully`
            )
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete User with user_id=' + id,
                details: err,
            })
        })
}
