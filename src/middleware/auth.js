const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = async (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'A token is reuiqred for authenication'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid Token'
        });
    }
}

module.exports = verifyToken