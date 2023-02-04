const Job = require("../models/jobModel")
const { StatusCodes } = require("http-status-codes")
const BadRequestError = require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")


exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt")

  res.status(StatusCodes.OK).json({
    count: jobs.length,
    jobs
  })
}

exports.getJob = async (req, res) => {
  const { params: { id: jobId }, user: { userId } } = req

  const job = await Job.findOne({ createdBy: userId, _id: jobId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}!`)
  }
  res.status(StatusCodes.OK).json({
    job
  })
}

exports.createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user.userId
  })

  res.status(StatusCodes.CREATED).json({
    job
  })
}
exports.updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position }
  } = req
  if (company === "" || position === "") {
    throw new BadRequestError("Company and position fields cannot be empty!")
  }
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}!`)
  }
  res.status(StatusCodes.OK).json({
    job
  })
}
exports.deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}!`)
  }
  res.status(StatusCodes.OK).send()
}