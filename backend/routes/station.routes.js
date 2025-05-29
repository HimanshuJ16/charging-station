const express = require("express")
const router = express.Router()
const stationController = require("../controllers/station.controller")
const { verifyToken } = require("../middleware/auth.jwt")

// Create a new charging station
router.post("/", verifyToken, stationController.create)

// Retrieve all charging stations
router.get("/", stationController.findAll)

// Retrieve a single charging station
router.get("/:id", stationController.findOne)

// Update a charging station
router.put("/:id", verifyToken, stationController.update)

// Delete a charging station
router.delete("/:id", verifyToken, stationController.delete)

// Get connector types
router.get("/types/connectors", stationController.getConnectorTypes)

module.exports = router
