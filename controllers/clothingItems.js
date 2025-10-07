const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!imageUrl || !name || !weather) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }
  const likes = [];
  return clothingItems
    .create({ name, weather, imageUrl, likes, owner: req.user._id })
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  return clothingItems
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      // 5. Proceed to delete the item
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted successfully" }));
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
        .send({ message: "Failed to delete item" });
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
