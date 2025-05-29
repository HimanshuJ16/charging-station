const { ChargingStation, sequelize } = require("../models")
const { Op } = sequelize

// Create a new charging station
exports.create = async (req, res) => {
  try {
    // Validate request
    if (
      !req.body.name ||
      !req.body.latitude ||
      !req.body.longitude ||
      !req.body.powerOutput ||
      !req.body.connectorType
    ) {
      return res.status(400).send({
        message: "All fields are required!",
      })
    }

    // Create charging station
    const station = await ChargingStation.create({
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      status: req.body.status || "Active",
      powerOutput: req.body.powerOutput,
      connectorType: req.body.connectorType,
      userId: req.userId,
    })

    res.status(201).send(station)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the charging station.",
    })
  }
}

// Retrieve all charging stations
exports.findAll = async (req, res) => {
  try {
    const { status, connectorType, minPower, maxPower } = req.query
    const condition = {}

    // Apply filters if provided
    if (status) {
      condition.status = status
    }

    if (connectorType) {
      condition.connectorType = connectorType
    }

    if (minPower && maxPower) {
      condition.powerOutput = {
        [Op.between]: [Number.parseFloat(minPower), Number.parseFloat(maxPower)],
      }
    } else if (minPower) {
      condition.powerOutput = {
        [Op.gte]: Number.parseFloat(minPower),
      }
    } else if (maxPower) {
      condition.powerOutput = {
        [Op.lte]: Number.parseFloat(maxPower),
      }
    }

    const stations = await ChargingStation.findAll({ where: condition })
    res.send(stations)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving charging stations.",
    })
  }
}

// Find a single charging station by id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id
    const station = await ChargingStation.findByPk(id)

    if (!station) {
      return res.status(404).send({
        message: `Charging station with id ${id} not found.`,
      })
    }

    res.send(station)
  } catch (error) {
    res.status(500).send({
      message: `Error retrieving charging station with id ${req.params.id}`,
    })
  }
}

// Update a charging station
exports.update = async (req, res) => {
  try {
    const id = req.params.id
    const station = await ChargingStation.findByPk(id)

    if (!station) {
      return res.status(404).send({
        message: `Charging station with id ${id} not found.`,
      })
    }

    // Check if user owns the station
    if (station.userId !== req.userId) {
      return res.status(403).send({
        message: "You do not have permission to update this charging station.",
      })
    }

    const [num] = await ChargingStation.update(req.body, {
      where: { id: id },
    })

    if (num === 1) {
      res.send({
        message: "Charging station was updated successfully.",
      })
    } else {
      res.send({
        message: `Cannot update charging station with id ${id}.`,
      })
    }
  } catch (error) {
    res.status(500).send({
      message: `Error updating charging station with id ${req.params.id}`,
    })
  }
}

// Delete a charging station
exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const station = await ChargingStation.findByPk(id)

    if (!station) {
      return res.status(404).send({
        message: `Charging station with id ${id} not found.`,
      })
    }

    // Check if user owns the station
    if (station.userId !== req.userId) {
      return res.status(403).send({
        message: "You do not have permission to delete this charging station.",
      })
    }

    const num = await ChargingStation.destroy({
      where: { id: id },
    })

    if (num === 1) {
      res.send({
        message: "Charging station was deleted successfully!",
      })
    } else {
      res.send({
        message: `Cannot delete charging station with id ${id}.`,
      })
    }
  } catch (error) {
    res.status(500).send({
      message: `Error deleting charging station with id ${req.params.id}`,
    })
  }
}

// Get connector types
exports.getConnectorTypes = async (req, res) => {
  try {
    const types = await ChargingStation.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("connector_type")), "connectorType"]],
      raw: true,
    })

    res.send(types.map((type) => type.connectorType))
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving connector types.",
    })
  }
}
