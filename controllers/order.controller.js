const db = require('../dbOperations')
const logger = require('../logger')
const executePaginatedQuery = require('../helper/paginationQuery')
const Razorpay = require('razorpay')
require('dotenv').config()
const crypto = require('crypto')
// Save orders
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
exports.post = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        // Extract the order data from the request body
        const {
            user_id,
            order_type,
            sub_total,
            tax,
            shipping,
            promo,
            discount,
            order_items,
            razorpay_id,
            selectedAddress,
            paymentdetails_id,
            /*get razorpay orderid and payment id then add to the table query*/
        } = req.body

        // Calculate the grand total
        const grand_total = sub_total - discount + tax + shipping

        // Insert the new order into the database
        const { rows } = await db.query(
            `INSERT INTO dev.orders (user_id, order_type, order_status, sub_total, item_discount, tax, shipping, total, promo, discount, grand_total,razorpay_order_id,address_id,payment_details_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13,$14)
     RETURNING *`,
            [
                user_id,
                order_type,
                0,
                sub_total,
                0,
                tax,
                shipping,
                grand_total,
                promo,
                discount,
                grand_total,
                razorpay_id,
                selectedAddress,
                paymentdetails_id,
            ]
        )

        // Insert the order items into the database
        const orderId = rows[0].order_id
        for (const item of order_items) {
            await db.query(
                `INSERT INTO dev.order_item (product_id, item_id, order_id, sku, price, discount, quantity)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    item.product_id,
                    item.item_id,
                    orderId,
                    item.sku,
                    item.price,
                    item.discount,
                    item.quantity,
                ]
            )
        }
        await db.query('COMMIT') // Commit the transaction

        // Send the newly created order as a JSON response
        res.status(201).json(rows[0])
        // console.log(rows[0], 'row data')
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({ error: err })
    }
}

// create razorpay orderid
exports.postCreate = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: 'receipt#1',
            payment_capture: 1,
        }

        const response = await instance.orders.create(options)
        res.status(201).json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
        // Handle any errors
        const errorObj = {
            message: 'Some error occurred while retrieving Orders.',
            details: err,
        }
        logger.error(errorObj)
        res.status(500).send(errorObj)
    }
}

// Find order by user id
exports.getById = async (req, res) => {
    try {
        const userId = req.params.id
        const query = `SELECT * FROM dev.orders AS ord WHERE ord.user_id = $1 ORDER BY ord.order_id DESC`
        const params = [userId]
        const result = await executePaginatedQuery(query, params, req.query)
        res.status(200).json(result)
    } catch (err) {
        // Handle any errors
        const errorObj = {
            message: 'Some error occurred while retrieving Orders.',
            details: err,
        }
        logger.error(errorObj)
        res.status(500).send(errorObj)
    }
}
//Get All orders of userid(BuyIt Again)
exports.getAll = async (req, res) => {
    try {
        const userId = req.params.id
        const skipCart = req.params.skipCart
        const Allorder_items = await db.query(
            `SELECT DISTINCT ON (oi.product_id) 
    ord.order_id,
    oi.product_id,
    p.product_name,
    p.product_img_uri,
    p.product_price,
    p.product_brand,
    p.product_type,
    p.product_quality,
    p.price_unit
FROM 
    dev.orders AS ord
JOIN 
    dev.order_item AS oi ON ord.order_id = oi.order_id
JOIN 
    dev.product AS p ON oi.product_id = p.product_id
LEFT JOIN 
    dev.cart AS ct ON ct.product_id = oi.product_id AND ct.user_id = $1
    LEFT JOIN 
    dev.wishlist AS wl ON wl.product_id = oi.product_id AND wl.user_id = $1
WHERE 
    ord.user_id = $1
    AND (       
        ($2 IS TRUE AND ct.product_id IS NULL)
        AND   ($2 IS TRUE AND wl.product_id IS NULL)
        OR        
        ($2 IS FALSE)
    ); `,
            [userId, skipCart]
        )
        res.status(200).json(Allorder_items.rows)
    } catch (error) {
        const errorObj = {
            message: 'Some error occurred while retrieving order items',
            details: error,
        }
        logger.error(errorObj)
        res.status(500).json(errorObj)
    }
}
