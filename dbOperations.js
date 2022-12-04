var config = require("./config/sqldb.config");
const sql = require("mssql");

async function get(query) {
    let pool = await sql.connect(config);
    let res = await pool.request().query(query);
    pool.close();
    return res.recordsets; 
}

async function post(query, params) { 
    let pool = await sql.connect(config);
    let request = pool.request();
    params.forEach(param => {
      request.input(param.name, sql[param.dataType], param.value)
    });
    const res =await request.query(query);
    pool.close();
    return res.recordsets;
  
}

module.exports = {
  get,post
};
