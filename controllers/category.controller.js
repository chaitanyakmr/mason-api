const Joi = require("joi");
const db = require("../dbOperations");

function validateCategory(category) {
  const JoiSchema = Joi.object({
    category_1_id: Joi.string().min(10).required(),
    category_name: Joi.string().min(2).max(50).required(),
    category_1_img_uri: Joi.string().min(5).max(100).optional(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(category);
}

// Retrieve all Categories from the database.
exports.get = (req, res) => {
  let query = "select * from dev.category_1";
  if (req.params.categoryLevel === "2") {
    query =
      "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id";
  }
  else if (req.params.categoryLevel === "3") {
    query =
      "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri,ct3.category_3_id,ct3.category_3_name,ct3.category_3_img_uri  from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id join dev.category_3 ct3 on ct3.category_2_id = ct2.category_2_id";
  }
  db.get(query)
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
// Retrieve all Categories from the database.
exports.post = (req, res) => {
  let query = '', inputParams = [];
  const validCategory = validateCategory(req.body);
  if (validCategory.error) {
    res.status(400).send({
      message: validCategory.error,
    });
    return;
  }
  if (req.params.categoryLevel === "1") {
    inputParams = [{ name: 'id', dataType: "int", value:req.validCategory.id }, {name: 'name', dataType: "VarChar", value: req.validCategory.name }, { name: 'uri', dataType: "VarChar", value: req.validCategory.uri }];
    query = `insert into dev.category_1 (category_1_id, category_1_name, category_1_img_uri) values (@${inputParams[0].name}, @${inputParams[1].name}, @${inputParams[2].name})`;
  }
  // else if (req.params.categoryLevel === "2") {
  //   query =
  //     "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id";
  // }
  // else if (req.params.categoryLevel === "3") {
  //   query =
  //     "select ct1.category_1_id,ct1.category_1_name,ct1.category_1_img_uri, ct2.category_2_id,ct2.category_2_name,ct2.category_2_img_uri,ct3.category_3_id,ct3.category_3_name,ct3.category_3_img_uri  from dev.category_1 ct1 join dev.category_2 ct2  on ct2.category_1_id = ct1.category_1_id join dev.category_3 ct3 on ct3.category_2_id = ct2.category_2_id";
  // }
  db.post(query)
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
