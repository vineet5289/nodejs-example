require("dotenv").config();
module.exports = {
  development: {
    username: "root",
    password: null,
    database: "database_development",
    host: "127.0.0.1",
    port: 5432,
    dialect: "mysql",
    operatorsAliases: false,
    redis: {
      host: "127.0.0.1",
      port: 6379
    }
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    port: 5432,
    dialect: "mysql",
    operatorsAliases: false,
    redis: {
      host: "127.0.0.1",
      port: 6379
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    operatorsAliases: false,
    redis: {
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT
    }
  }
};
