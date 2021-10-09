require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

// Logic goes here
app.use(morgan('dev'));

module.exports = app;