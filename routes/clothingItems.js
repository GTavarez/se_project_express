const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const clothingItem = require("../models/clothingItem");
const { INTERNAL_SERVER_ERROR } = require("../utils/errors");

router.get("/", getItems);
router.get("/me", auth, (req, res) => {
  clothingItem
    .find({ owner: req.user._id })
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to retrieve user's items" });
    });
});
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
