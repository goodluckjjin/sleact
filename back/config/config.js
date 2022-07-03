require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "127.0.0.1",
    dialect: "mysql",
    port: "3095",
  },
  test: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
