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

/* exports.getById = async (req, res) => {
    const product_id = req.params.id

    try {
        // Query to calculate the average rating, total reviews, and fetch comments for the product
        const result = await db.query(
            `SELECT 
                AVG(rating) AS average_rating, 
                COUNT(*) AS total_reviews, 
                ARRAY_AGG(description) AS comments
             FROM dev.reviews 
             WHERE product_id = $1`,
            [product_id]
        )

        // Check if the product has reviews
        if (result.rows.length === 0 || result.rows[0].total_reviews === 0) {
            return res.status(200).json({
                product_id,
                average_rating: null, // No rating available
                total_reviews: 0, // No reviews
                comments: [], // No comments
                message: 'This product has no reviews yet.',
            })
        }

        // Respond with the average rating, total reviews, and comments
        res.status(200).json({
            product_id,
            average_rating: parseFloat(result.rows[0].average_rating).toFixed(
                1
            ), // 1 decimal place
            total_reviews: parseInt(result.rows[0].total_reviews, 10),
            comments: result.rows[0].comments || [], // Default to empty array if no comments
        })
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction in case of an error
        res.status(500).json({
            error: 'Error retrieving average rating and comments',
            details: err.message,
        })
    }
} */
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
                total_reviews: parseInt(row.total_reviews, 10),
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
