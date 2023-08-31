const express = require("express");
const db = require("./config/database");
require("dotenv").config();
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
const testRoute = require("./routes/test.route");

//api
app.use("/test", testRoute);

//Connect to Database
db.connect();

// server
app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
