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
      servicable_pincodes: {
        type: Sequelize.STRING(300),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      product_id: {
        type: Sequelize.BIGINT,
      },
      // created_date: {
      //   type: "TIMESTAMP",
      //   defaultValue: new Date().toISOString(),
      //   allowNull: false,
      // },
      // modified_date: {
      //   type: "TIMESTAMP",
      //   defaultValue: new Date().toISOString(),
      //   allowNull: false,
      // },
      godown_img_uri: {
        type: Sequelize.STRING(300),
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
