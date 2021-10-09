const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, trim: true },
    password: { type: String, trim: true },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);