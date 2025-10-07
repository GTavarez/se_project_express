const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

router.post("/signup", (req, res) => {
  const { email, password, name, avatar } = req.body;
  if (!email || !password || !name || !avatar) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ email, password: hash, name, avatar }).then((user) => {
        const token = user.generateAuthToken();
        res.status(201).send({
          token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        });
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server Error" });
    });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = user.generateAuthToken();
      res.send({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    });
});

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserProfile);

module.exports = router;
