module.exports = (sequelize, Sequelize) => {
  const ChargingStation = sequelize.define("charging_station", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    latitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    status: {
      type: Sequelize.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    powerOutput: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: "power_output",
    },
    connectorType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: "connector_type",
    },
  })

  return ChargingStation
}
