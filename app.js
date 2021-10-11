require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const morgan = require("morgan");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logic goes here
app.use(morgan('dev'));
app.use('/', router);
app.use('/api', router);
app.use('/api/v1', router);

module.exports = app;