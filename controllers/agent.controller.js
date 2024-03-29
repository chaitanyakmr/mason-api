// const Joi = require("joi");
const db = require("../dbOperations");
// const Agent = db.agent;

// function validateAgent(agent) {
//   const JoiSchema = Joi.object({
//     agent_name: Joi.string().min(2).max(50).required(),
//     agent_contact_number: Joi.string().min(10).max(15).optional(),
//     agent_address: Joi.string().min(5).max(100).required(),
//   }).options({ abortEarly: false });

//   return JoiSchema.validate(agent);
// }

// const formatAgent = ({ agent_name, agent_contact_number, agent_address }) => {
//   return { agent_name, agent_contact_number, agent_address };
// };

// Create and Save a new Agent
// exports.post = (req, res) => {
//   const agent = formatAgent(req.body);
//   const validAgent = validateAgent(agent);
//   if (validAgent.error) {
//     res.status(400).send({
//       message: validAgent.error,
//     });
//     return;
//   }
//   agent.agent_id = Date.now();
//   // Save Agent in the database
//   Agent.create(agent)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Agent.",
//       });
//     });
// };

// Retrieve all Agents from the database.
exports.get = (req, res) => {
  db.query("select * from dev.agent")
  .then((data) => { 
    res.status(200).json(data.rows);
  })
  .catch((err) => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Agents.",
    });
  });
};

// Find a single Agent with an id
exports.getById = (req, res) => {
  const agent_id = req.params.id;
  db.query(`select * from dev.agent where agent_id=${agent_id}`)
  .then((data) => { 
    res.status(200).json(data.rows);
  })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Agent with id=" + agent_id,
        details: err,
      });
    });
};

// // Update a Agent by the id in the request
// exports.put = (req, res) => {
//   const id = req.params.id;
//   const validAgent = validateAgent(req.body);
//   if (validAgent.error) {
//     res.status(400).send({
//       message: validAgent.error,
//     });
//   }
//   Agent.update(req.body, {
//     where: { agent_id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Agent was updated successfully.",
//         });
//       } else {
//         res.send({
//           message: `Cannot update Agent with id=${id}. Maybe Agent was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating Agent with id=" + id,
//         details: err,
//       });
//     });
// };

// // Delete a Agent with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Agent.destroy({
//     where: { agent_id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Agent was deleted successfully!",
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Agent with id=${id}. Maybe Agent was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete Agent with id=" + id,
//         details: err,
//       });
//     });
// };
