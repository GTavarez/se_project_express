const clothingItems = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!imageUrl || !name || !weather) {
    return res.status(400).send({ message: "Missing required fields" });
  }
  return clothingItems
    .create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }

      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Failed to retrieve items" });
    });
};
const updateItem = (req, res) => {
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
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  return clothingItems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: "Failed to delete item" });
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
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: "Failed to like item" });
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
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: "Failed to unlike item" });
    });
};
module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
