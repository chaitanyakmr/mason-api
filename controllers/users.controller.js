const Joi = require("joi");
const db = require("../dbOperations");
// const User = db.users;

function validateUser(user) {
  const JoiSchema = Joi.object({
    user_firstname: Joi.string().min(1).max(50).required(),
    user_lastname: Joi.string().min(1).max(50).required(),
    user_dob: Joi.date().required(),
    user_contact_number: Joi.string().min(1).max(50).required(),
    user_email: Joi.string().min(3).max(300).required().email(),
    username: Joi.string().min(1).max(50).required(),
    user_role: Joi.string().min(1).max(50).required(), 
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}

// Retrieve all User from the database.
exports.get = (req, res) => {
  db.query('select * from dev.users')
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};


// Find a single User with an id
exports.getById = (req, res) => {
  const user_id = req.params.id;
  db.query(`select * from dev.users where user_id=$0`,[user_id])
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + user_id,
        details: err,
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
   // Save User in the database/
  db.query(
    `INSERT INTO dev.users (user_firstname, user_lastname, user_contact_number, user_email, user_role, username, user_dob)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user.user_firstname, user.user_lastname, user.user_contact_number,user.user_email,user.user_role,user.username ,user.user_dob]
  )
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};


// Update a User by the id in the request
exports.put = (req, res) => {
  const id = req.params.id;
  const validUser = validateUser(req.body);
  if (validUser.error) {
    res.status(400).send({
      message: validUser.error,
    }); 
  return;
  }
  db.query(
    `UPDATE dev.users SET user_firstname=$1, user_lastname=$2, user_contact_number=$3, user_email=$4, user_role=$5, username=$6, user_dob=$7 ,modified_date=$8 where user_id=$9
     RETURNING *`,
    [req.body.user_firstname, req.body.user_lastname, req.body.user_contact_number, req.body.user_email, req.body.user_role, req.body.username, req.body.user_dob,new Date().toUTCString() , id]
  )
    .then((data) => {
      if (data.rows.length > 0) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.status(400).send({
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
  db.query('delete from dev.users where user_id=$1',[id])
    .then((data) => { 
      res.status(200).send(`User with the user_id ${data.rows.user_id} deleted successfully`);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with user_id=" + id,
        details: err,
      });
    });
};
