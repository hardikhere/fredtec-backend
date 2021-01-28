const express = require("express");
const morgan = require("morgan");
const connect_db = require("./utils/database");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const SchoolRoutes = require("./Routes/School");
const UserRoutes = require("./Routes/User");
const SendResponse = require("./utils/Responses");
const helmet = require("helmet");
connect_db();// connect to mongoDB

var whitelist = ['http://localhost:3000/', 'http://localhost:8080/',
    "https://fredmat-frontend.hardikhere.vercel.app/"
];
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

//app middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(
    bodyParser.urlencoded({
        extended: false,
    }));
app.use(bodyParser.json())
app.use(morgan(process.env.NODE_ENV || "dev"));

//API routes
const BaseAPI = "/api/v1";
app.use(BaseAPI, SchoolRoutes);
app.use(BaseAPI, UserRoutes);

// health check API
app.use("/health-check", (req, res) => {
    SendResponse(res, 200, {}, "Healthy");
});




const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server started at ${port}`)
})