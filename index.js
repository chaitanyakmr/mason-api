const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const factoryRouter = require("./routes/factory.routes");
const productRouter = require("./routes/product.routes");
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("DB synced");
});
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(
  '/api-docs',
  swaggerUI.serve, 
  swaggerUI.setup(swaggerDocument)
);

app.use("/api/factory", factoryRouter);
app.use("/api/product", productRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listenting on port ${port}`));
