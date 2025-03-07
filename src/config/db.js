const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    database: "MediatorPortal",
    password: "root",
})

module.exports = pool;