const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});
module.exports = router;
