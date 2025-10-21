const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateItemId, validateCardBody } = require("../middlewares/validate");

router.get("/", getItems);

router.post("/", auth, validateCardBody, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.put(`/:itemId/likes`, auth, validateItemId, likeItem);
router.delete(`/:itemId/likes`, auth, validateItemId, unlikeItem);

module.exports = router;
