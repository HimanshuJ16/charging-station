const { Sequelize } = require("sequelize")

// Determine if we're in production or using a cloud database
const isProduction = process.env.NODE_ENV === "production"
const isCloudDatabase = process.env.DATABASE_URL && process.env.DATABASE_URL.includes("ssl=true")

const sequelizeOptions = {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
}

// Add SSL configuration for cloud databases
if (isProduction || isCloudDatabase) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
}

const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Import models
db.User = require("./user.model")(sequelize, Sequelize)
db.ChargingStation = require("./station.model")(sequelize, Sequelize)

// Define relationships
db.User.hasMany(db.ChargingStation, { as: "stations" })
db.ChargingStation.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
})

module.exports = db
