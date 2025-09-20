const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.status(200).send(
        users.map((user) => ({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        }))
      )
    )
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      }).then((user) =>
        res.status(201).send({
          user: { name: user.name, avatar: user.avatar, email: user.email },
        })
      )
    )

    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already in use" });
      }
      // if block checking if a duplicate email error has occurec, and if so seng back a 409 with an appropriate message
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const { _id: userId } = req.user;
  return User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      return res.status(200).send({
        user: { name: user.name, avatar: user.avatar, email: user.email },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Cast Error" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user)
        return res.status(401).send({ message: "Invalid credentials" });
      return bcrypt
        .compare(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid)
            return res.status(401).send({ message: "Invalid credentials" });
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          return res.status(200).send({
            message: "Login successful",
            token,
            user: { name: user.name, avatar: user.avatar, email: user.email },
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(401).send({ message: "Invalid email or password" });
        });
    });
};
/* const getUserPublicProfile = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) =>
      res.status(200).send({
        user: { name: user.name, avatar: user.avatar },
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Cast Error" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}; */
const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      return res.status(200).send({
        user: { name: user.name, avatar: user.avatar, email: user.email },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "name and avatar are required" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Cast Error" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
