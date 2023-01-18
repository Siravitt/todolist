const express = require("express");
const app = express();

const notFound = require("./middleware/notFound");
const error = require("./middleware/error");

app.use(express.json());


app.use(notFound);

app.use(error);

app.listen(8013, () => console.log("Server run on port 8013"));
