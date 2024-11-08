const db = require('../dbOperations')

exports.post = async (req, res) => {
    try {
        // Start a transaction
        await db.query('BEGIN')

        const { product_id, quantity, user_id } = req.body
        console.log('Request data:', product_id, quantity, user_id)

        // Check if the item already exists in the cart for the same user
        if (req.method === 'PUT') {
            const existingItem = await db.query(
                `SELECT * FROM dev.cart WHERE product_id = $1 AND user_id = $2`,
                [product_id, user_id]
            )

            let result
            if (existingItem.rows.length > 0) {
                // If item already exists, update the quantity
                result = await db.query(
                    `UPDATE dev.cart SET quantity = $1 WHERE product_id = $2 AND user_id = $3 RETURNING *`,
                    [quantity, product_id, user_id]
                )
                await db.query('COMMIT')
                return res.status(200).json(result.rows[0])
            } else {
                return res
                    .status(404)
                    .json({ error: 'Item not found for update' })
            }
        } else if (req.method === 'POST') {
            // If item does not exist, insert a new entry
            const result = await db.query(
                `INSERT INTO dev.cart (product_id, quantity, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
                [product_id, quantity, user_id]
            )

            // Commit the transaction
            await db.query('COMMIT')

            // Send the updated or newly created cart item as a JSON response
            return res.status(201).json(result.rows[0])
        } else {
            return res.status(405).json({ error: 'Method not allowed' })
        }
    } catch (err) {
        console.error('Error updating cart item:', err)
        // Roll back the transaction in case of an error
        await db.query('ROLLBACK')
        res.status(500).json({ error: 'Failed to add/update item in cart' })
    }
}
// Find cart with an userid
exports.getById = (req, res) => {
    const userId = req.params.id

    // Query to join cart and product tables based on product_id
    const query = `
        SELECT c.cart_id, c.product_id,c.quantity,c.user_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
        FROM dev.cart AS c
        JOIN dev.product AS p ON c.product_id = p.product_id
        WHERE c.user_id = $1
    `

    db.query(query, [userId])
        .then((result) => {
            res.status(200).json(result.rows) // Send back the list of products with details
        })
        .catch((err) => {
            // console.error('Error retrieving cart with details:', err)
            res.status(500).json({
                message: 'Error retrieving cart with product details',
                details: err.message,
            })
        })
}

// Delete a single whishlist with an id
exports.delete = (req, res) => {
    const { userId, productId } = req.body // Retrieve userId and productId from the request body
    //console.log(userId, productId)
    db.query(`DELETE FROM dev.cart WHERE user_id = $1 AND product_id = $2`, [
        userId,
        productId,
    ])
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
