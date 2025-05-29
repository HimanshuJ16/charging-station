require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { sequelize } = require("./models")
const authRoutes = require("./routes/auth.routes")
const stationRoutes = require("./routes/station.routes")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:8080",
      "http://localhost:8080",
      "http://localhost:3000",
      "http://127.0.0.1:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/stations", stationRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Charging Station API",
    status: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// Health check route
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Start server
async function startServer() {
  try {
    console.log("Connecting to database...")
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")

    // Sync database models (create tables if they don't exist)
    console.log("Synchronizing database models...")
    await sequelize.sync({ alter: true })
    console.log("Database models synchronized successfully.")

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Health check available at: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    console.error("Please check your DATABASE_URL in the .env file")
    process.exit(1)
  }
}

startServer()
