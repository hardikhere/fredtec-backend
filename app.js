const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));

app.listen(8080, () => {
    console.log("server started at 8080")
})