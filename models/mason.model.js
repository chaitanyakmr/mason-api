module.exports = (sequelize, Sequelize) => {
  const Mason = sequelize.define(
    "mason",
    {
      mason_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      mason_name: {
        type: Sequelize.STRING(50),
      },
      mason_contact_number: {
        type: Sequelize.STRING(15),
      },
      mason_address: {
        type: Sequelize.STRING(100),
      },
    },
    {
      schema: "dev",
      freezeTableName: true,
    }
  );
  Mason.removeAttribute("id");

  return Mason;
};
