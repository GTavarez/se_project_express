const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});
module.exports = router;
