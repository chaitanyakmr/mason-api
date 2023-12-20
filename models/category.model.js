module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "category",
    {
      category_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(75),
      },
      meta_title: {
        type: Sequelize.STRING(100),
      },
      slug: {
        type: Sequelize.STRING(100),
      },
      content: {
        type: Sequelize.CHAR(40),
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      category_img_uri: {
        type: Sequelize.STRING(200),
      },
    },
    {
      schema: "dev",
      freezeTableName: true,
    }
  );
  Category.removeAttribute("id");

  return Category;
};
