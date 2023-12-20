module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define(
    "customer",
    {
      customer_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
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
      freezeTableName: true,
    }
  );
  Customer.removeAttribute("id");

  return Customer;
};
