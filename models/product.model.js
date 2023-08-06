module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "product",
    {
      product_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      product_name: {
        type: Sequelize.STRING(50),
      },
      product_brand: {
        type: Sequelize.STRING(50),
      },
      product_type: {
        type: Sequelize.STRING(50),
      },
      product_quality: {
        type: Sequelize.STRING(50),
      },
      product_price: {
        type: Sequelize.DECIMAL(18, 0)
      },
    },
    {
      schema: "dev",
    }
  );
  Product.removeAttribute("id");

  return Product;
};
