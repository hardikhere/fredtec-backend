const express = require("express");
const morgan = require("morgan");
const connect_db = require("./utils/database");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const SchoolRoutes = require("./Routes/School");
const SendResponse = require("./utils/Responses");
connect_db();// connect to mongoDB


//app middlewares
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false,
    }));
app.use(bodyParser.json())
app.use(morgan("dev"));

//API routes
const BaseAPI = "/api/v1";
app.use(BaseAPI, SchoolRoutes);
// health check API
app.use("/health-check", (req, res) => {
    SendResponse(res, 200, {}, "Healthy");
});



const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server started at ${port}`)
})