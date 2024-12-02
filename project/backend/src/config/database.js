// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postsdb_25m4",
  "postsdb_25m4_user",
  "QXlBRlFIBtVYvzPg4QLaCNAQ22BqLpl7",
  {
    host: "dpg-clcl3g3mot1c73dhae70-a.oregon-postgres.render.com",
    port: 5432, // Replace with the actual port
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Use this if your PostgreSQL server uses a self-signed certificate
      },
    },
    logging: false, // Set to true if you want to log SQL queries
  }
);

module.exports = sequelize;
