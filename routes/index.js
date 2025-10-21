const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validate");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../errors/NotFoundError");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLoginBody, login);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);
router.use(() => {
  throw new NotFoundError("Requested resource not found");
});
module.exports = router;
