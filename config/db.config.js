module.exports = {
  HOST: "manuscripts.ckuivhwsutd1.ap-south-1.rds.amazonaws.com",
  USER: "anji",
  PASSWORD: "Welcome1",
  DB: "mason",
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
