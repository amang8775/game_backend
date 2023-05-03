const express = require("express");
const connectToDb = require("./config/database");
const cors = require("cors");
require("dotenv").config();
const cookie = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookie());
app.use(cors());

app.use("/user", require(`./routes/user`));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// connect to db

connectToDb();
