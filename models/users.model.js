module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "users",
    {
      user_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_firstname: {
        type: Sequelize.STRING(50),
      },
      user_lastname: {
        type: Sequelize.STRING(50),
      },
      user_dob: {
        type: Sequelize.DATE,
      },
      user_contact_number: {
        type: Sequelize.STRING(50),
      },
      user_email: {
        type: Sequelize.STRING(50),
      },
      username: {
        type: Sequelize.STRING(50),
      },
      user_role: {
        type: Sequelize.STRING(50),
      },
      // created_date: {
      //   type: Sequelize.DATE,
      // },
      // updated_date: {
      //   type: Sequelize.DATE,
      // },
    },
    {
      schema: "dev",
    }
  );
  Users.removeAttribute("id");

  return Users;
};
