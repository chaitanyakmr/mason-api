const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.factory = require("./factory.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.agent = require("./agent.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.agent.hasOne(db.customer, {
  foreignKey: "agent_id",
});
db.customer.belongsTo(db.agent, {
  foreignKey: "agent_id",
});

db.godown = require("./godown.model.js")(sequelize, Sequelize);
db.agent.hasOne(db.godown, {
  foreignKey: "agent_id",
});
db.godown.belongsTo(db.agent, {
  foreignKey: "agent_id",
});

db.mason = require("./mason.model.js")(sequelize, Sequelize);
db.agent.hasOne(db.mason, {
  foreignKey: "agent_id",
});
db.mason.belongsTo(db.agent, {
  foreignKey: "agent_id",
});

db.brands = require("./brands.model.js")(sequelize, Sequelize)

module.exports = db;
