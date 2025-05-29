require("dotenv").config()
const { sequelize, User, ChargingStation } = require("./models")
const bcrypt = require("bcryptjs")

async function setupDatabase() {
  try {
    console.log("Connecting to database...")

    // Test the connection
    await sequelize.authenticate()
    console.log("Database connection established successfully.")

    console.log("Synchronizing database models...")

    // Sync all models with database (this creates the tables)
    await sequelize.sync({ force: true })
    console.log("Database synchronized successfully")

    console.log("Creating admin user...")

    // Create admin user
    const adminPassword = "admin123"
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    })

    console.log("Admin user created successfully")
    console.log("Admin User ID:", adminUser.id)
    console.log("Username: admin")
    console.log("Password: admin123")

    // Create sample charging stations
    console.log("Creating sample charging stations...")

    const sampleStations = [
      {
        name: "Downtown Charging Hub",
        latitude: 40.7128,
        longitude: -74.006,
        status: "Active",
        powerOutput: 150.0,
        connectorType: "CCS",
        userId: adminUser.id,
      },
      {
        name: "Mall Parking Station",
        latitude: 40.7589,
        longitude: -73.9851,
        status: "Active",
        powerOutput: 50.0,
        connectorType: "Type 2",
        userId: adminUser.id,
      },
      {
        name: "Highway Rest Stop",
        latitude: 40.6892,
        longitude: -74.0445,
        status: "Inactive",
        powerOutput: 250.0,
        connectorType: "CHAdeMO",
        userId: adminUser.id,
      },
    ]

    for (const stationData of sampleStations) {
      await ChargingStation.create(stationData)
    }

    console.log("Sample charging stations created successfully")
    console.log("Database setup completed!")

    process.exit(0)
  } catch (error) {
    console.error("Error setting up database:", error)
    console.error("Error details:", error.message)

    if (error.name === "SequelizeConnectionError") {
      console.error("Please check your database connection string in the .env file")
    }

    process.exit(1)
  }
}

setupDatabase()
