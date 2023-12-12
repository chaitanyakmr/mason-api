const Pool = require('pg').Pool

const pool = new Pool({
    user: 'chaitanya',
    host: 'mason-db-server.postgres.database.azure.com',
    database: 'mason',
    password: 'Chaitanya123',
    port: 5432,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
        },
    },
})

module.exports = pool
