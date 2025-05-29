module.exports = {
  secret: process.env.JWT_SECRET || "charging-station-secret-key",
  jwtExpiration: 86400, // 24 hours
}
