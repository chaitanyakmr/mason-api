const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pgadmin@mason-pgsql',
  host: 'mason-pgsql.postgres.database.azure.com',
  database: 'postgres',
  password: 'Welcome@1',
  port: 5432,
  ssl: true,
  dialectOptions: {
     ssl: {
        require: true
     }
   }
});

async function get(query) {
 await pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
   return  results.rows;
  });
}

async function post(query, params) { 
  // let pool = await sql.connect(config);
  // let request = pool.request();
  // params.forEach(param => {
  //   request.input(param.name, sql[param.dataType], param.value)
  // });
  // const res =await request.query(query);
  // pool.close();
  //  res.recordsets;

  let res = await pool.query(query, params.map(x => x.value), (error, results) => {
    if (error) {
      throw error
    };
    return results.rows;
  });
  return res;
}

module.exports = pool;
