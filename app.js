const express = require("express");
const morgan = require("morgan");
const connect_db = require("./utils/database");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const SchoolRoutes = require("./Routes/School");
connect_db();// connect to mongoDB


//app middlewares
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }));
app.use(bodyParser.json())
app.use(morgan("dev"));

//API routes
const BaseAPI = "/api/v1";
app.use(BaseAPI, SchoolRoutes);
// health check API
app.use("/health-check", (req, res) => {
    res.send("Healthy");
});



const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server started at ${port}`)
})