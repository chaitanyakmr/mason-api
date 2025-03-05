const db = require('../dbOperations')
const logger = require('../logger')

// Find order by user id
/* exports.getById = async (req, res) => {
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
 */
exports.getById = async (req, res) => {
    try {
        const order_id = req.params.id
        const order_items = await db.query(
            `SELECT  o.order_id ,o.price,o.quantity, o.order_item_id, o.product_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
             FROM dev.order_item AS o
             JOIN dev.product AS p ON o.product_id = p.product_id WHERE o.order_id = $1 ORDER BY o.order_item_id DESC`,
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

//Get all orders(people Also ordered)
exports.getAll = async (req, res) => {
    const userId = req.params.id
    try {
        const order_items = await db.query(
            `SELECT DISTINCT ON (oi.product_id)  
    oi.product_id,
     ord.order_id,
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
WHERE ( ct.product_id IS NULL) AND   ( wl.product_id IS NULL); `,
            [userId]
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

//Get all orders
/* exports.getAll = async (req, res) => {
    try {
        const order_items = await db.query(
            `SELECT DISTINCT o.product_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
             FROM dev.order_item AS o
             JOIN dev.product AS p ON o.product_id = p.product_id`
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
} */
