require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const cors = require("cors");
const userRoutes = require("./routes/users");
const itemsRoutes = require("./routes/clothingItems");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/items", itemsRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
