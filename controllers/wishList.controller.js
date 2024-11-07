const db = require('../dbOperations')

exports.post = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        // Extract the order data from the request body
        const { user_id, product_id } = req.body
        // console.log(user_id, product_id)
        // Insert the new order into the database
        const { rows } = await db.query(
            `INSERT INTO dev.wishlist (user_id,product_id )
     VALUES ($1, $2)
     RETURNING *`,
            [user_id, product_id]
        )

        await db.query('COMMIT') // Commit the transaction

        // Send the newly created order as a JSON response
        res.status(201).json(rows[0])
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        res.status(500).json({ error: err })
    }
}
// Find wishlist with an userid
/*exports.getById = (req, res) => {
    const userId = req.params.id

    // Query to join wishlist and product tables based on product_id
    const query = `
        SELECT w.wishlist_id, w.product_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
        FROM dev.wishlist AS w
        JOIN dev.product AS p ON w.product_id = p.product_id
        WHERE w.user_id = $1
    `

    db.query(query, [userId])
        .then((result) => {
            res.status(200).json(result.rows) // Send back the list of products with details
        })
        .catch((err) => {
            console.error('Error retrieving wishlist with details:', err)
            res.status(500).json({
                message: 'Error retrieving wishlist with product details',
                details: err.message,
            })
        })
}*/
exports.getById = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        // Retrieve user_id from the request, assuming it comes from a decoded token (e.g., set by middleware)
        const user_id = req.params.id

        // Query to get wishlist items along with product details
        const { rows } = await db.query(
            `SELECT w.wishlist_id, w.product_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
             FROM dev.wishlist AS w
             JOIN dev.product AS p ON w.product_id = p.product_id
             WHERE w.user_id = $1`,
            [user_id]
        )

        await db.query('COMMIT') // Commit the transaction

        // Send the wishlist items with product details as a JSON response
        res.status(200).json(rows)
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving wishlist with product details',
            details: err.message,
        })
    }
}

// Delete a single whishlist with an id
exports.delete = (req, res) => {
    const { userId, productId } = req.body // Retrieve userId and productId from the request body
    //console.log(userId, productId)
    db.query(
        `DELETE FROM dev.wishlist WHERE user_id = $1 AND product_id = $2`,
        [userId, productId]
    )
        .then(() => {
            res.status(200).json({
                message: `Product with ID: ${productId} is deleted`,
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error deleting the product with id=' + productId,
                details: err,
            })
        })
}

exports.delete = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        // Extract user_id and product_id from the request body
        const { userId, productId } = req.body

        // Query to delete the wishlist item for the specified user and product
        const result = await db.query(
            `DELETE FROM dev.wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *`,
            [userId, productId]
        )

        await db.query('COMMIT') // Commit the transaction

        // Send a success message as JSON
        res.status(200).json({
            message: `Wishlist item with product_id: ${productId} deleted successfully`,
        })
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error deleting wishlist item',
            details: err.message,
        })
    }
}
