module.exports = (sequelize, Sequelize) => {
  const Agent = sequelize.define(
    "agent",
    {
      agent_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      agent_name: {
        type: Sequelize.STRING(50),
      },
      agent_contact_number: {
        type: Sequelize.STRING(15),
      },
      agent_address: {
        type: Sequelize.STRING(100),
      },
    },
    {
      schema: "dev",
    }
  );
  Agent.removeAttribute("id");

  return Agent;
};
