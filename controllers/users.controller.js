const Joi = require("joi");
const db = require("../models");
const User = db.users;

function validateUser(user) {
  const JoiSchema = Joi.object({
    user_id: Joi.string().min(5).max(50).required(),
    user_firstname: Joi.string().min(1).max(50).required(),
    user_lastname: Joi.string().min(1).max(50).required(),
    user_dob: Joi.date().required(),
    user_contact_number: Joi.string().min(1).max(50).required(),
    user_email: Joi.string().min(3).max(50).required(),
    username: Joi.string().min(1).max(50).required(),
    user_role: Joi.string().min(1).max(50).required(),
    // created_date: Joi.date(),
    // updated_date: Joi.date(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}

// Retrieve all User from the database.
exports.get = (req, res) => {
  Product.findAll({ where: req.query })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

// Create and Save a new User
exports.post = (req, res) => {
  const user = req.body;
  const validUser = validateUser(user);
  if (validUser.error) {
    res.status(400).send({
      message: validUser.error,
    });
    return;
  }
  user.user_id = Date.now();
  // Save User in the database
  user
    .create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Find a single User with an id
exports.getById = (req, res) => {
  const user_id = req.params.id;
  User.findByPk(user_id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
        details: err,
      });
    });
};

// Update a User by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;

  const validUser = validateUser(req.body);
  if (validUser.error) {
    res.status(400).send({
      message: validProduct.error,
    });
    validUser;
    return;
  }
  User.update(req.body, {
    where: { user_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
        details: err,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { user_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
        details: err,
      });
    });
};
