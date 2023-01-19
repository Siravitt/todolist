// const { sequelize } = require("./models");

// sequelize.sync({ force: true });
require("dotenv").config();
const express = require("express");
const app = express();

const authenticate = require("./middleware/authenticate")
const notFound = require("./middleware/notFound");
const error = require("./middleware/error");

const authRoute = require("./routes/authRoute");
const todoRoute = require("./routes/todoRoute");

app.use(express.json());

app.use("/auth", authRoute);
app.use("/todos", authenticate, todoRoute);

app.use(notFound);

app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server run on port: " + port));
