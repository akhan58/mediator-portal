const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "A token is reuiqred for authenication",
    });
  }

  try {
    // Our code doesn't strip the type from the header (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#authorization_and_proxy-authorization_headers)
    // So we need to do this here
    // We could just not include the auth type, but including the type is more standard. probably. I don't know for sure
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;
