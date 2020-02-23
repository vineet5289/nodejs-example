module.exports = {
    mysql: {
        client: "mysql",
        version: '5.7',
        connection: {
            host : '127.0.0.1',
            user : 'root',
            password : '9ol.<KI*&UJM',
            database : 'my_test_db'
        },
        pool: {
            min: 1,
            max: 1
        },
        debug: true
    }
}