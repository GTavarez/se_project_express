// the idea behind this auth middleware is to receive the token, verify it, and if it's valid, extract the payload and add it to the request object so that subsequent middlewares or route handlers can access the user information contained in the token. We will purposely run this auth middleware before any route that needs needs to know the currently logged in user's _id

const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET); // e.g. { _id: "abc123" }

    req.user = payload; // attach the payload to req
    return next(); // go to the next middleware/route
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
}

module.exports = auth;
