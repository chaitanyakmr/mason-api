const Joi = require("joi");
const db = require("../dbOperations");

// Retrieve all Categories from the database.
exports.get = (req, res) => {
  db.executeQuery(
    "  select * from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id join dev.category_3 ct3 on ct3.category_2_id = ct2.category_2_id"
  )
    .then((data) => {
      console.log(data);
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Categories.",
      });
    });
};
