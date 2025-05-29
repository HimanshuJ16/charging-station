const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")

// Register a new user
router.post("/signup", authController.signup)

// Login user
router.post("/signin", authController.signin)

module.exports = router
