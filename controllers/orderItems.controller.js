const db = require('../dbOperations')
const logger = require('../logger')

// Find order by user id
exports.getById = async (req, res) => {
    try {
        const order_id = req.params.id
        const order_items = await db.query(
            `SELECT * FROM dev.order_item as itm WHERE itm.order_id = $1 ORDER BY itm.order_item_id DESC`,
            [order_id]
        )
        res.status(200).json(order_items.rows)
    } catch (error) {
        const errorObj = {
            message: 'Some error occurred while retrieving order items',
            details: error,
        }
        logger.error(errorObj)
        res.status(500).json(errorObj)
    }
}
