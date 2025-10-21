// the idea behind this auth middleware is to receive the token, verify it, and if it's valid, extract the payload and add it to the request object so that subsequent middlewares or route handlers can access the user information contained in the token. We will purposely run this auth middleware before any route that needs needs to know the currently logged in user's _id

const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new (UnauthorizedError("Authorization required"))();
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET); // e.g. { _id: "abc123" }

    req.user = payload; // attach the payload to req
    return next(); // go to the next middleware/route
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }
}
/* function auth(req, res, next) {
  try {
    console.log('=== AUTH DEBUG ===');
    console.log('Headers received:', req.headers);
    console.log('Authorization header:', req.headers.authorization);

    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      console.log('❌ No valid authorization header');
      return res.status(401).send({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "");
    console.log('Extracted token:', token.substring(0, 20) + '...');

    const payload = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified, payload:', payload);

    req.user = payload;
    return next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(401).send({ message: "Authorization required" });
  }
} */

module.exports = auth;
