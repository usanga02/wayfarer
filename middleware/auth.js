const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  var token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({
      status: "Access Denied",
      error: "No token provided"
    });

  try {
    req.user = jwt.verify(token, config.get("jwtPrivateKey"));
    next();
  } catch (e) {
    res.status(400).send({
      status: "Access Denied",
      error: "Invalid token"
    });
  }
};
