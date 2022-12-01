const Joi = require("joi");
const db = require("../dbOperations");

// Retrieve all Categories from the database.
exports.get = (req, res) => {
  let query = "select * from dev.category_1";
  if (req.params.categoryLevel === "2") {
    query =
      "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id";
  }
  if (req.params.categoryLevel === "3") {
    query =
      "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri,ct3.category_3_id,ct3.category_3_name,ct3.category_3_img_uri  from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id join dev.category_3 ct3 on ct3.category_2_id = ct2.category_2_id";
  }
  db.executeQuery(query)
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Categories.",
      });
    });
};
