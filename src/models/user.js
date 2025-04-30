const pool = require('../config/db');

//TODO -- adjust authController to use these functions
const users = {
    async getUsers ({username}) {
        const results = await pool.query(`SELECT * FROM users where "username" = $1`,
            [username]
        );

        return results.rows[0];
    },

    async createUsers ({username, email, password}) {
        const results = await pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email`,
            [username, email, password]
        );

        return results.rows[0];
    },

    async deleteUser(userId) {
        const results = await pool.query(`DELETE FROM users WHERE "user_id" = $1`,
            [userId]
        );
        
        return results.rowCount > 0;
    }
}

module.exports = users;