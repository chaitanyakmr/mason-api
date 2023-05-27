// const Joi = require('joi')  
const db = require('../dbOperations')

// function validateProduct(product) {
//     const JoiSchema = Joi.object({
//         product_name: Joi.string().min(5).max(50).required(),
//         product_price: Joi.number().min(1).required(),
//         product_brand: Joi.string().min(1),
//         product_type: Joi.string().min(1),
//         product_quality: Joi.string().min(1),
//     }).options({ abortEarly: false })

//     return JoiSchema.validate(product)
// }

// Retrieve all Products from the database.
exports.get = (req, res) => {
    let queryParam ='';
if(req.query.name) {
    queryParam =` where LOWER(pr.product_name) like '%${req.query.name.toLowerCase()}%'`;
}

    db.query(
        `Select pr.product_id, pr.product_name, pr.product_brand,pr.product_type,pr.product_quality,
        pr.product_price, pr.price_unit, pr.is_active, pr.created_date,pr.modified_date, pr.product_img_uri,
        ct3.category_3_name,ct3.category_3_id, ct2.category_2_name,ct2.category_2_id, gd.godown_name, br.title, ofr.offer_name, ofr.offer_code, ofr.maximum_discount_amount,
        ofr.minimum_order_value from dev.product pr
        left join dev.category_3 ct3 on ct3.category_3_id = pr.category_3_id
        left join dev.category_2 ct2 on ct2.category_2_id = pr.category_2_id
       left join dev.godown gd on gd.godown_id = pr.godown_id
       left join dev.brands br on br.brand_id = pr.brand_id
       left join dev.offers ofr on ofr.offer_id = pr.offer_id ${queryParam}`
    )
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving products.',
            })
        })
}

// Retrieve all products where id is category level 2
exports.getById = (req, res) => {
    let queryParam ='';
    if(Object.keys(req.query).length) {
        if(req.query.brand) {
            queryParam +=`AND pr.brand_id=${req.query.brand}`;  
        }
        if(req.query.category) {          
        queryParam+=` AND pr.category_3_id=${req.query.category}`;
        }
        if(req.query.name) {          
            queryParam+=` AND LOWER(pr.product_name) like '%${req.query.name.toLowerCase()}%'`;
            }
    }

    console.log( `Select pr.product_id, pr.product_name, pr.product_brand,pr.product_type,pr.product_quality,
    pr.product_price, pr.price_unit, pr.is_active, pr.created_date,pr.modified_date, pr.product_img_uri,
    ct3.category_3_name,ct3.category_3_id, ct2.category_2_name,ct2.category_2_id, gd.godown_name, br.title, ofr.offer_name, ofr.offer_code, ofr.maximum_discount_amount,
    ofr.minimum_order_value from dev.product pr
    left join dev.category_3 ct3 on ct3.category_3_id = pr.category_3_id
    left join dev.category_2 ct2 on ct2.category_2_id = pr.category_2_id
   left join dev.godown gd on gd.godown_id = pr.godown_id
   left join dev.brands br on br.brand_id = pr.brand_id
   left join dev.offers ofr on ofr.offer_id = pr.offer_id where ct3.category_2_id = ${req.params.id} ${queryParam}`);
     
        db.query(
            `Select pr.product_id, pr.product_name, pr.product_brand,pr.product_type,pr.product_quality,
            pr.product_price, pr.price_unit, pr.is_active, pr.created_date,pr.modified_date, pr.product_img_uri,
            ct3.category_3_name,ct3.category_3_id, ct2.category_2_name,ct2.category_2_id, gd.godown_name, br.title, ofr.offer_name, ofr.offer_code, ofr.maximum_discount_amount,
            ofr.minimum_order_value from dev.product pr
            left join dev.category_3 ct3 on ct3.category_3_id = pr.category_3_id
            left join dev.category_2 ct2 on ct2.category_2_id = pr.category_2_id
           left join dev.godown gd on gd.godown_id = pr.godown_id
           left join dev.brands br on br.brand_id = pr.brand_id
           left join dev.offers ofr on ofr.offer_id = pr.offer_id where ct3.category_2_id = ${req.params.id} ${queryParam}`
        )
            .then((data) => {
                res.status(200).json(data.rows || [])
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message ||
                        'Some error occurred while retrieving products.',
                })
            })
    }
    