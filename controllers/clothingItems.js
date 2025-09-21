const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!imageUrl || !name || !weather) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }
  return clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "An error has occurred on the server" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server Error" });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to retrieve items" });
    });
};
/* const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl, name, weather } = req.body;

  clothingItems
    .findByIdAndUpdate(itemId, { $set: { imageUrl, name, weather } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data for update" });
      }
      return res.status(500).send({ message: "Failed to update item" });
    });
}; */
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  return clothingItems.findById(itemId).then((item) => {
    // 2. Check if item exists
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    // 4. Check if item has an owner and ownership matches
    if (!item.owner || item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN)
        .send({ message: "Forbidden: you can only delete your own items" });
    }

    // 5. Proceed to delete the item
    return clothingItems
      .findByIdAndDelete(itemId)
      .then(() =>
        res.status(200).send({ message: "Item successfully deleted" })
      )
      .catch((err) => {
        console.error(err);
        if (err.name === "DocumentNotFoundError") {
          return res.status(NOT_FOUND).send({ message: "Item not found" });
        }
        if (err.name === "CastError") {
          return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
        }
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Failed to delete item" });
      });
  });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  return clothingItems
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item)
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to like item" });
    });
};
const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  return clothingItems
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to unlike item" });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
