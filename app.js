require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const cors = require("cors");

app.use(cors());

const usersRouter = require("./routes/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use("/", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
