module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define(
    "agent",
    {
      customer_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      agent_id: {
        type: Sequelize.STRING(50),
        schema: "dev",
        references: "agent",
        referencesKey: "agent_id",
      },
      customer_name: {
        type: Sequelize.STRING(50),
      },
      customer_contact_number: {
        type: Sequelize.STRING(15),
      },
      customer_address: {
        type: Sequelize.STRING(100),
      },
    },
    {
      schema: "dev",
    }
  );
  Customer.removeAttribute("id");

  return Customer;
};
