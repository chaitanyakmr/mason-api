const Joi = require("joi");
const db = require("../models");
const Godown = db.godown;
const Agent = db.agent;

function validateGodown(agent) {
  const JoiSchema = Joi.object({
    agent_id: Joi.string().min(10).required(),
    godown_name: Joi.string().min(2).max(50).required(),
    godown_contact_number: Joi.string().min(10).max(15).optional(),
    godown_address: Joi.string().min(5).max(100).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(agent);
}

const formatCustomer = ({
  agent_id,
  godown_name,
  godown_contact_number,
  godown_address,
}) => {
  return { agent_id, godown_name, godown_contact_number, godown_address };
};

// Create and Save a new Godown
exports.post = (req, res) => {
  const godown = formatCustomer(req.body);
  const validGodown = validateGodown(godown);
  if (validGodown.error) {
    res.status(400).send({
      message: validGodown.error,
    });
    return;
  }
  Agent.findByPk(godown.agent_id)
    .then(() => {
      godown.godown_id = Date.now();

      // Save Godown in the database
      Godown.create(godown)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Godown.",
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
  Godown.findAll({ include: [{ model: Agent }] })
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

// Find a single Godown with an id
exports.getById = (req, res) => {
  const godown_id = req.params.id;
  Godown.findAll({
    include: [{ model: Agent }],
    where: {
      godown_id,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Godown with id=" + id,
        details: err,
      });
    });
};

// Update a Godown by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  const godown = formatCustomer(req.body);
  const validGodown = validateGodown(godown);
  if (validGodown.error) {
    res.status(400).send({
      message: validGodown.error,
    });
  }

  Agent.findByPk(godown.agent_id).then(() => {
    godown.godown_id = Date.now();

    Godown.update(req.body, {
      where: { godown_id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Godown was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update Godown with id=${id}. Maybe Godown was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Godown with id=" + id,
          details: err,
        });
      });
  });
};

// Delete a Godown with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Godown.destroy({
    where: { godown_id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Godown was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Godown with id=${id}. Maybe Godown was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Godown with id=" + id,
        details: err,
      });
    });
};
