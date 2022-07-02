const Joi = require("joi");
const db = require("../models");
const Factory = db.factory;

function validateFactory(factory) {
  const JoiSchema = Joi.object({
    factory_name: Joi.string().min(5).max(50).required(),
    factory_contact_number: Joi.string().min(10).max(15).optional(),
    factory_address: Joi.string().min(5).max(30).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(factory);
}

// Create and Save a new Factory
exports.post = (req, res) => {
  const { factory_name, factory_contact_number, factory_address } = req.body;
  // Create a Factory
  const factory = {
    factory_name,
    factory_contact_number,
    factory_address,
  };
  const validFactory = validateFactory(factory);
  if (validFactory.error) {
    res.status(400).send({
      message: validFactory.error,
    });
    return;
  }
  factory.factory_id= Date.now();
  console.log(factory);
  // Save Factory in the database
  Factory.create(factory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Factory.",
      });
    });
};

// Retrieve all Factories from the database.
exports.get = (req, res) => {
  console.log("get");
  Factory.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving factories.",
      });
    });
};

// Find a single Factory with an id
exports.getById = (req, res) => {
  console.log(req.params.id);
  const factory_id = req.params.id;
  Factory.findByPk(factory_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Factory with id=" + id,
        details: err,
      });
    });
};

// Update a Factory by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  Factory.update(req.body, {
    where: { factory_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Factory was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Factory with id=${id}. Maybe Factory was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Factory with id=" + id,
        details: err,
      });
    });
};

// Delete a Factory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Factory.destroy({
    where: { factory_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Factory was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Factory with id=${id}. Maybe Factory was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Factory with id=" + id,
        details: err,
      });
    });
};
