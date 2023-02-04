const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("No token provided!")
  }
  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { userId, name } = decoded
    req.user = { userId, name }
    next()
  } catch (error) {
    throw new UnauthenticatedError("Not authorized!")
  }
}