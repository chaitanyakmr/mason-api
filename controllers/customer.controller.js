const Joi = require("joi");
const db = require("../models");
const Customer = db.customer;
const Agent = db.agent;

function validateCustomer(agent) {
  const JoiSchema = Joi.object({
    agent_id: Joi.string().min(10).required(),
    customer_name: Joi.string().min(2).max(50).required(),
    customer_contact_number: Joi.string().min(10).max(15).optional(),
    customer_address: Joi.string().min(5).max(100).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(agent);
}

const formatCustomer = ({
  agent_id,
  customer_name,
  customer_contact_number,
  customer_address,
}) => {
  return { agent_id, customer_name, customer_contact_number, customer_address };
};

// Create and Save a new Customer
exports.post = (req, res) => {
  const customer = formatCustomer(req.body);
  const validCustomer = validateCustomer(customer);
  if (validCustomer.error) {
    res.status(400).send({
      message: validCustomer.error,
    });
    return;
  }
  Agent.findByPk(customer.agent_id)
    .then(() => {
      customer.customer_id = Date.now();

      // Save Customer in the database
      Customer.create(customer)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Customer.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Agent with id=" + agent_id,
        details: err,
      });
    });
};

// Retrieve all Agents from the database.
exports.get = (req, res) => {
  Customer.findAll({ include: [{ model: Agent }] })
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

// Find a single Customer with an id
exports.getById = (req, res) => {
  const customer_id = req.params.id;
  Customer.findAll({
    include: [{ model: Agent }],
    where: {
      customer_id,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Customer with id=" + id,
        details: err,
      });
    });
};

// Update a Customer by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  const customer = formatCustomer(req.body);
  const validCustomer = validateCustomer(customer);
  if (validCustomer.error) {
    res.status(400).send({
      message: validCustomer.error,
    });
  }

  Agent.findByPk(customer.agent_id).then(() => {
    customer.customer_id = Date.now();

    Customer.update(req.body, {
      where: { customer_id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Customer was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Customer with id=" + id,
          details: err,
        });
      });
  });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Customer.destroy({
    where: { customer_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Customer was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Customer with id=" + id,
        details: err,
      });
    });
};
