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

/*validate the razor payment payment*/
exports.postres = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body

        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        //order_id + "|" + razorpay_payment_id
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const digest = sha.digest('hex')
        if (digest !== razorpay_signature) {
            return res.status(400).json({ msg: 'Transaction is not legit!' })
        }
        res.json({
            msg: 'success',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
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
exports.getByPaymentId = async (req, res) => {
    try {
        const payment_id = req.params.id
        const payment = await instance.payments.fetch(payment_id)

        res.json(payment)
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

exports.postByPaymentId = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        const { payment_id, user_id } = req.body
        //console.log(payment_id)
        const payment = await instance.payments.fetch(payment_id)

        // Insert the new payment into the database
        /*   const { rows } = await db.query(
            `INSERT INTO dev.payment_details (user_id, paytm_transaction_id)
     VALUES ($1, $2)`,
            [user_id, payment_id]
        ) */

        await db.query('COMMIT') // Commit the transaction

        // Send All payment Details from razorpay
        res.status(201).json(payment)
        // res.status(201).json(rows[0])
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({ error: err })
    }
}
