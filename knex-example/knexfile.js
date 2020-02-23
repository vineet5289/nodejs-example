// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '9ol.<KI*&UJM',
      database : 'my_test_db'
    },
    migrations: {
      tableName: "knex_migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
