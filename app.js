require("dotenv").config()
require("express-async-errors")
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const express = require("express")

const jobRoutes = require("./routes/jobRouter")
const authRoutes = require("./routes/authRouter")
const { authenticate } = require("./middlewares/authentication")
const { notFound } = require("./middlewares/not-found")
const { errorHandler } = require("./middlewares/error-handler")
const connectDB = require("./db/connect")

const app = express()

app.set("trust proxy", 1)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again in fifteen minutes!"
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

//routers
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/jobs", authenticate, jobRoutes)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()