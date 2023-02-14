const Joi = require("joi");
const db = require("../models");
const Brands = db.brands;

function validateBrand(brand) {
  const JoiSchema = Joi.object({
    title: Joi.string().min(2).max(75).required(),
    summary: Joi.string().max(20),
    content: Joi.string().max(40), 
  }).options({ abortEarly: false });

  return JoiSchema.validate(brand);
}

// Retrieve all Brands from the database.
// Retrieve all Brands from the database.
exports.get = (req, res) => {
  Brands.findAll({ where: req.query })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving brands.",
      });
    });
};

// Create and Save a new Brand
exports.post = (req, res) => {
  const brand = req.body;
  const validBrand = validateBrand(brand);
   if (validBrand.error) {
    res.status(400).send({
      message: validBrand.error,
    });
    return;
  }
  brand.brand_id = Date.now();
  // brand.created_date =Sequelize.NOW;
  // Save Brands in the database
  Brands.create(brand)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Brands.",
      });
    });
};

// Find a single Brands with an id
exports.getById = (req, res) => {
  const brand_id = req.params.id;
  Brands.findByPk(brand_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Brands with id=" + id,
        details: err,
      });
    });
};

// Update a Brands by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;

  const validBrand = validateBrand(req.body);
  if (validBrand.error) {
    res.status(400).send({
      message: validBrand.error,
    });
    return;
  }
  Brands.update(req.body, {
    where: { brand_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Brand was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Brand with id=" + id,
        details: err,
      });
    });
};

// Delete a Brands with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Brands.destroy({
    where: { brand_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Brand was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Brand with id=${id}. Maybe Brand was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Brand with id=" + id,
        details: err,
      });
    });
};
