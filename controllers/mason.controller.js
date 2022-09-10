const Joi = require("joi");
const db = require("../models");
const Mason = db.mason;
const Agent = db.agent;

function validateMason(agent) {
  const JoiSchema = Joi.object({
    agent_id: Joi.string().min(10).required(),
    mason_name: Joi.string().min(2).max(50).required(),
    mason_contact_number: Joi.string().min(10).max(15).optional(),
    mason_address: Joi.string().min(5).max(100).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(agent);
}

const formatMason = ({
  agent_id,
  mason_name,
  mason_contact_number,
  mason_address,
}) => {
  return { agent_id, mason_name, mason_contact_number, mason_address };
};

// Create and Save a new Mason
exports.post = (req, res) => {
  const mason = formatMason(req.body);
  const validGodown = validateMason(mason);
  if (validGodown.error) {
    res.status(400).send({
      message: validGodown.error,
    });
    return;
  }
  Agent.findByPk(mason.agent_id)
    .then(() => {
      mason.mason_id = Date.now();

      // Save Mason in the database
      Mason.create(mason)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Mason.",
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

// Retrieve all Masons from the database.
exports.get = (req, res) => {
  Mason.findAll({ include: [{ model: Agent }], where: req.query })
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

// Find a single Mason with an id
exports.getById = (req, res) => {
  const mason_id = req.params.id;
  Mason.findAll({
    include: [{ model: Agent }],
    where: {
      mason_id,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Mason with id=" + id,
        details: err,
      });
    });
};

// Update a Mason by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  const mason = formatMason(req.body);
  const validGodown = validateMason(mason);
  if (validGodown.error) {
    res.status(400).send({
      message: validGodown.error,
    });
  }

  Agent.findByPk(mason.agent_id).then(() => {
    mason.mason_id = Date.now();

    Mason.update(req.body, {
      where: { mason_id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Mason was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Mason with id=${id}. Maybe Mason was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Mason with id=" + id,
          details: err,
        });
      });
  });
};

// Delete a Mason with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Mason.destroy({
    where: { mason_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Mason was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Mason with id=${id}. Maybe Mason was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Mason with id=" + id,
        details: err,
      });
    });
};
