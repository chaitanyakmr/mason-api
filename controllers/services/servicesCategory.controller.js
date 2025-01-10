const db = require('../dbOperations')

// Retrieve all Categories from the database.
exports.get = (req, res) => {
    let query = 'select * from dev.services'
    if (req.query.categoryLevel === '2') {
        query =
            'select ct1.services_id,ct1.services_name,ct1.services_img, ct2.sub_services_id,ct2.sub_services_name,ct2.sub_services_img from dev.services ct1 join dev.sub_services ct2  on ct2.services_id = ct1.services_id'
    } else if (req.query.categoryLevel === '3') {
        query =
            'select ct1.services_id,ct1.services_name,ct1.services_img, ct2.sub_services_id,ct2.sub_services_name,ct2.sub_services_img,ct3.child_services_id,ct3.child_services_name,ct3.child_services_img  from dev.services ct1 join dev.sub_services ct2  on ct2.services_id = ct1.services_id join dev.child_services ct3 on ct3.sub_services_id = ct2.sub_services_id'
    }
    db.query(query)
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving Categories.',
            })
        })
}

// Retrieve Categories by parent category id from the database.
exports.getById = (req, res) => {
    const { category_id } = req.params
    let query = `select * from dev.services where services_id=${category_id}`
    if (req.query.categoryLevel === '2') {
        query = `select ct1.services_id,ct1.services_name,ct1.services_img, ct2.sub_services_id,ct2.sub_services_name,ct2.sub_services_img from dev.services ct1 join dev.sub_services ct2  on ct2.services_id = ct1.services_id where ct1.services_id=${category_id}`
    } else if (req.query.categoryLevel === '3') {
        query = `select ct1.services_id,ct1.services_name,ct1.services_img, ct2.sub_services_id,ct2.sub_services_name,ct2.sub_services_img,ct3.child_services_id,ct3.child_services_name,ct3.child_services_img  from dev.services ct1 join dev.sub_services ct2  on ct2.services_id = ct1.services_id join dev.child_services ct3 on ct3.sub_services_id = ct2.sub_services_id where ct2.sub_services_id=${category_id}`
    }
    db.query(query)
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving Categories by id.',
            })
        })
}
