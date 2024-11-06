module.exports = (sequelize, Sequelize) => {
    const Wishlist = sequelize.define(
        'wishlist',
        {
            wishlist_id: {
                type: Sequelize.STRING(20),
                primaryKey: true,
                unique: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING(20),
            },
            product_id: {
                type: Sequelize.STRING(20),
            },
            product_qty: {
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
            },
        },
        {
            schema: 'dev',
        }
    )
    Wishlist.removeAttribute('id')

    return Wishlist
}
