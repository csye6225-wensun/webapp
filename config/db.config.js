module.exports = {
    host: "127.0.0.1",
    user: "root",
    password: "r",
    db: "assignment",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};