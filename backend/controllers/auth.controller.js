const { User } = require("../models")
const config = require("../config/auth.config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.signup = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Username, email, and password are required!",
      })
    }

    // Create user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })

    res.status(201).send({
      message: "User registered successfully!",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the user.",
    })
  }
}

exports.signin = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    })

    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password!",
      })
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    })

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred during login.",
    })
  }
}
