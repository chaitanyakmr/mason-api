var config = require("./config/sqldb.config");
const sql = require("mssql");

async function executeQuery(query) {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query(query);
    pool.close();
    return res.recordsets;
  } catch (error) {
    console.log("db-error :" + error);
    throw error;
  }
}

module.exports = {
  executeQuery: executeQuery,
};
