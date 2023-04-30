// const Joi = require('joi')
const db = require('../dbOperations')
 
// Retrieve all Products filters from the database.
exports.get = (req, res) => {
    db.query(
        `select distinct(pd.category_3_id), ct3.category_3_name from dev.product pd join dev.category_3 ct3 on ct3.category_3_id=pd.category_3_id order by ct3.category_3_name asc;
        select distinct(pd.brand_id), br.title from dev.product pd join dev.brands br on br.brand_id=pd.brand_id order by br.title asc`
    )
        .then((data) => { 
            res.status(200).json({categories: data[0].rows, brands: data[1].rows})
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving product filters.',
            })
        })
}
