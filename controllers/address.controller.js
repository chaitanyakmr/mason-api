const db = require('../dbOperations')

exports.post = async (req, res) => {
    try {
        // Start a transaction
        await db.query('BEGIN')

        const {
            address_id,
            user_id,
            first_name,
            middle_name,
            last_name,
            mobile,
            email,
            address,
            city,
            state,
            pincode,
            country,
            default_address,
        } = req.body

        if (default_address) {
            await db.query(
                `UPDATE dev.address SET default_address = false WHERE user_id = $1`,
                [user_id]
            )
        }

        if (req.method === 'PUT') {
            const { rows } = await db.query(
                `UPDATE dev.address SET user_id=$1, first_name=$2, middle_name=$3, last_name=$4, mobile=$5, email=$6, address=$7, city=$8, state=$9,pincode =$10, country=$11,default_address=$12
              WHERE address_id=$13 RETURNING *`,
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
                    pincode,
                    country,
                    default_address,
                    address_id,
                ]
            )

            await db.query('COMMIT')
            // Send the newly created order as a JSON response
            res.status(201).json(rows[0])
        } else if (req.method === 'POST') {
            const { rows } = await db.query(
                `INSERT INTO dev.address (user_id, first_name, middle_name, last_name, mobile, email, address, city, state, pincode, country,default_address)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12)
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
                    pincode,
                    country,
                    default_address,
                ]
            )
            await db.query('COMMIT')
            // Send the newly created order as a JSON response
            res.status(201).json(rows[0])
        } else {
            return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (err) {
        console.error('Error updating address:', err)
        // Roll back the transaction in case of an error
        await db.query('ROLLBACK')
        res.status(500).json({ error: 'Failed to add/update address' })
    }
}

// Retrieve all Addresses from the database.
exports.get = (req, res) => {
    const userId = req.params.id
    db.query(
        'select * from dev.address where user_id=$1 ORDER BY default_address DESC',
        [userId]
    )
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
