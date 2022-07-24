const Joi = require("joi");
const db = require("../models");
const Product = db.product;

function validateProduct(product) {
  const JoiSchema = Joi.object({
    factory_name: Joi.string().min(5).max(50).required(),
    factory_contact_number: Joi.string().min(10).max(15).optional(),
    factory_address: Joi.string().min(5).max(30).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(product);
}

// Retrieve all Products from the database.
exports.get = (req, res) => {
  Product.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products.",
      });
    });
};

// Create and Save a new Product
exports.post = (req, res) => {
  const { factory_name, factory_contact_number, factory_address } = req.body;
  // Create a Product
  const product = {
    factory_name,
    factory_contact_number,
    factory_address,
  };
  const validFactory = validateFactory(product);
  if (validFactory.error) {
    res.status(400).send({
      message: validFactory.error,
    });
    return;
  }
  product.product_id = Date.now();
  // Save Product in the database
  Product.create(product)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    });
};

// Find a single Product with an id
exports.getById = (req, res) => {
  const product_id = req.params.id;
  Product.findByPk(product_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id,
        details: err,
      });
    });
};

// Update a Product by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  Product.update(req.body, {
    where: { product_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Product with id=" + id,
        details: err,
      });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Product.destroy({
    where: { product_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id,
        details: err,
      });
    });
};
