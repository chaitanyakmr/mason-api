module.exports = (sequelize, Sequelize) => {
    const Brands = sequelize.define(
      "brands",
      {
        brand_id: {
          type: Sequelize.STRING(20),
          primaryKey: true,
          unique: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(75),
        },
        summary: {
          type: Sequelize.STRING(20),
        },
        content: {
          type: Sequelize.STRING(40),
        },
        created_date: {
            type: Sequelize.DATE, 
            // get: function() {  
            //   return this.getDataValue('created_date')
            //     .toLocaleString('en-In', { timeZone: 'UTC' }); 
            // }
           
        },
        updated_date: {
            type: Sequelize.DATE, 
            // get: function() {  
            //   return this.getDataValue('updated_date')
            //     .toLocaleString('en-In', { timeZone: 'UTC' }); 
            // }
        }
      },
      {
        schema: "dev",
      }
    );
    Brands.removeAttribute("id");
  
    return Brands;
  };
  