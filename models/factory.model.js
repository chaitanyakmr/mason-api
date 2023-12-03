module.exports = (sequelize, Sequelize) => {
  const Factory = sequelize.define(
    "factory",
    {
      factory_id: {
        type: Sequelize.STRING(20), 
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      factory_name: {
        type: Sequelize.STRING(100),
      },
      factory_contact_number: {
        type: Sequelize.STRING(15),
      },
      factory_address: {
        type: Sequelize.STRING(150),
      },
    },
    {
      schema: "dev",
    }
  );
  Factory.removeAttribute("id");

  return Factory;
};
