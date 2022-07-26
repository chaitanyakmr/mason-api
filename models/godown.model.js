module.exports = (sequelize, Sequelize) => {
  const Godown = sequelize.define(
    "godown",
    {
      godown_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      godown_name: {
        type: Sequelize.STRING(50),
      },
      godown_contact_number: {
        type: Sequelize.STRING(15),
      },
      godown_address: {
        type: Sequelize.STRING(100),
      },
    },
    {
      schema: "dev",
      freezeTableName: true,
    }
  );
  Godown.removeAttribute("id");

  return Godown;
};
