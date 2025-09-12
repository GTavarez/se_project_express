const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem); // PUT request to http://localhost:3001/items/1238192eu129/likes
//req.params = { itemId: '1238192eu129' }
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
