const db = require('../dbOperations')

exports.post = async (req, res) => {
    try {
        const {
            user_id,
            first_name,
            middle_name,
            last_name,
            mobile,
            email,
            address,
            city,
            state,
            country,
        } = req.body

        // Insert the new order into the database
        const { rows } = await db.query(
            `INSERT INTO dev.address (user_id, first_name, middle_name, last_name, mobile, email, address, city, state, country)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING *`,
            [
                user_id,
                first_name,
                middle_name,
                last_name,
                mobile,
                email,
                address,
                city,
                state,
                country,
            ]
        )

        // Send the newly created order as a JSON response
        res.status(201).json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err })
    } finally {
        db.release() // Release the connection back to the pool
    }
}

// Retrieve all Addresses from the database.
exports.get = (req, res) => {
    db.query('select * from dev.address')
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving Addresses.',
            })
        })
}

// Find a single Address with an id
exports.getById = (req, res) => {
    const address_id = req.params.id
    db.query('select * from dev.address where address_id=$1', [address_id])
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving Address with id=' + address_id,
                details: err,
            })
        })
}

// Find a single Address with an id and update required properties
exports.put = async (req, res) => {
    try {
        const address_id = req.params.id
        const {
            user_id,
            first_name,
            middle_name,
            last_name,
            mobile,
            email,
            address,
            city,
            state,
            country,
        } = req.body

        // Update the address into the database
        const { rows } = await db.query(
            `UPDATE TABLE dev.address SET user_id=$1, first_name=$2, middle_name=$3, last_name=$4, mobile=$5, email=$6, address=$7, city=$8, state=$9, country=$10
          WHERE address_id=$11 RETURNING *`,
            [
                user_id,
                first_name,
                middle_name,
                last_name,
                mobile,
                email,
                address,
                city,
                state,
                country,
                address_id,
            ]
        )

        // Send the newly created order as a JSON response
        res.status(201).json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err })
    } finally {
        db.release() // Release the connection back to the pool
    }
}

// Delete a single Address with an id
exports.delete = (req, res) => {
    const address_id = req.params.id
    db.query(`DELETE from dev.address where address_id=$1`, [address_id])
        .then(() => {
            res.status(200).json({
                message: `Address with ID: ${address_id} is deleted`,
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error deleting the Address with id=' + address_id,
                details: err,
            })
        })
}
