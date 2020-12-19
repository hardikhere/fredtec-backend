const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();

app.use(morgan("dev"));
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server started at ${port}`)
})