const { Router } = require("express")
const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobController")

const router = Router()

router
  .route("/")
  .get(getAllJobs)
  .post(createJob)

router
  .route("/:id")
  .get(getJob)
  .patch(updateJob)
  .delete(deleteJob)

module.exports = router