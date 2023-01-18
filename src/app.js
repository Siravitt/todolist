// const { sequelize } = require("./models");

// sequelize.sync({ force: true });

const express = require("express");
const app = express();

const notFound = require("./middleware/notFound");
const error = require("./middleware/error");

const authRoute = require("./routes/authRoute");

app.use(express.json());

app.use("/auth", authRoute);

app.use(notFound);

app.use(error);

app.listen(8013, () => console.log("Server run on port 8013"));
