const db = require('../dbOperations')

exports.post = async (req, res) => {
    const { user_id, product_id, rating, description } = req.body
    //console.log(user_id, product_id, rating, description)
    try {
        const result = await db.query(
            `INSERT INTO dev.reviews (user_id,product_id,rating,description) 
             VALUES ($1,$2,$3,$4) 
             RETURNING *`,
            [user_id, product_id, rating, description]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        // console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving reviews',
            details: err.message,
        })
    }
}
exports.update = async (req, res) => {
    const { user_id, product_id, rating, description } = req.body

    try {
        // Update the review
        const result = await db.query(
            `UPDATE dev.reviews 
             SET rating = $3, description = $4
             WHERE user_id = $1 AND product_id = $2 
             RETURNING *`,
            [user_id, product_id, rating, description]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction in case of an error
        res.status(500).json({
            error: 'Error updating review',
            details: err.message,
        })
    }
}
exports.getById = async (req, res) => {
    const user_id = req.params.id

    try {
        const result = await db.query(
            `select * from dev.reviews where user_id=$1'
             RETURNING *`,
            [user_id]
        )

        res.status(201).json(result.rows)
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction in case of an error
        res.status(500).json({
            error: 'Error updating review',
            details: err.message,
        })
    }
}

exports.getAll = async (req, res) => {
    try {
        // Query to calculate the average rating and total reviews for each product
        const result = await db.query(
            `SELECT 
    re.product_id, 
    AVG(re.rating) AS average_rating, 
    COUNT(re.rating) AS total_reviews, 
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'user_id', re.user_id, 
            'user_firstname', us.user_firstname, 
            'user_lastname', us.user_lastname, 
            'comment', re.description
        )
    ) AS comments
FROM dev.reviews AS re
JOIN dev.users AS us 
    ON us.user_id = re.user_id
GROUP BY re.product_id;`
        )

        // If no reviews are found, return an empty response
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No reviews found',
            })
        }

        // Respond with the list of products with their average ratings and total reviews
        res.status(200).json(
            result.rows.map((row) => ({
                comments: row.comments,
                product_id: row.product_id,
                average_rating: parseFloat(row.average_rating).toFixed(1), // 1 decimal place
                total_reviews: row.total_reviews,
            }))
        )
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction in case of an error
        console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving average ratings',
            details: err.message,
        })
    }
}
