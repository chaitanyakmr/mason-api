// const Joi = require("joi");
const db = require('../dbOperations')
// const Brands = db.brands;

// function validateBrand(brand) {
//   const JoiSchema = Joi.object({
//     title: Joi.string().min(2).max(75).required(),
//     summary: Joi.string().max(20),
//     content: Joi.string().max(40),
//   }).options({ abortEarly: false });

//   return JoiSchema.validate(brand);
// }

// Retrieve all Brands from the database.
exports.get = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        const { rows } = await db.query('select * from dev.brands')

        await db.query('COMMIT') // Commit the transaction

        // Send the wishlist items with product details as a JSON response
        res.status(200).json(rows)
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        //console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving brands',
            details: err.message,
        })
    }
}

exports.getByCatId = async (req, res) => {
    try {
        const catId = req.params.id
        await db.query('BEGIN') // Begin a new transaction

        const { rows } = await db.query(
            `SELECT * FROM dev.brands WHERE category_2_id = $1`,
            [catId]
        )

        await db.query('COMMIT') // Commit the transaction

        // Send the wishlist items with product details as a JSON response
        res.status(200).json(rows)
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        //console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving brands',
            details: err.message,
        })
    }
}

// // Create and Save a new Brand
// exports.post = (req, res) => {
//   const brand = req.body;
//   const validBrand = validateBrand(brand);
//    if (validBrand.error) {
//     res.status(400).send({
//       message: validBrand.error,
//     });
//     return;
//   }
//   brand.brand_id = Date.now();
//   // brand.created_date =Sequelize.NOW;
//   // Save Brands in the database
//   Brands.create(brand)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Brands.",
//       });
//     });
// };

/* // Find a single Brands with an id
exports.getById = (req, res) => {
    const brand_id = req.params.id
    db.query(`select * from dev.brands where brand_id=${brand_id}`)
        .then((data) => {
            res.status(200).json(data.rows)
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving Brands with id=' + brand_id,
                details: err,
            })
        })
}
 */
exports.getById = async (req, res) => {
    try {
        await db.query('BEGIN') // Begin a new transaction

        const brandId = req.params.id

        // Query to get items along with product details
        const { rows } = await db.query(
            `SELECT br.brand_id, p.brand_id,p.product_id, p.category_2_id, p.product_name, p.product_img_uri, p.product_price, p.product_brand,p.product_type,p.product_quality,p.price_unit
           FROM dev.brands AS br
           JOIN dev.product AS p ON br.brand_id = p.brand_id
           WHERE br.brand_id = $1`,
            [brandId]
        )

        await db.query('COMMIT') // Commit the transaction

        // Send the items with product details as a JSON response
        res.status(200).json(rows)
    } catch (err) {
        await db.query('ROLLBACK') // Roll back the transaction
        //console.error('Detailed Error:', err) // Log the complete error object
        res.status(500).json({
            error: 'Error retrieving brands with product details',
            details: err.message,
        })
    }
}

// // Update a Brands by the id in the request
// exports.put = (req, res) => {
//   const id = req.params.id;

//   const validBrand = validateBrand(req.body);
//   if (validBrand.error) {
//     res.status(400).send({
//       message: validBrand.error,
//     });
//     return;
//   }
//   Brands.update(req.body, {
//     where: { brand_id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Brand was updated successfully.",
//         });
//       } else {
//         res.send({
//           message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating Brand with id=" + id,
//         details: err,
//       });
//     });
// };

// // Delete a Brands with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Brands.destroy({
//     where: { brand_id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Brand was deleted successfully!",
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Brand with id=${id}. Maybe Brand was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete Brand with id=" + id,
//         details: err,
//       });
//     });
// };
