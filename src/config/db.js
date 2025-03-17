const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

module.exports = pool;