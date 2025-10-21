require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const cors = require("cors");
const { errors } = require("celebrate");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
