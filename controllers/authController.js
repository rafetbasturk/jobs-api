const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/userModel")

exports.register = async (req, res) => {
  const user = await User.create(req.body)
  const token = user.createToken()
  res.status(StatusCodes.CREATED).json({
    user: { name: user.name },
    token
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password!")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials!")
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials!")
  }
  const token = user.createToken()
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token
  })
}