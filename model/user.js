const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, trim: true },
    password: { type: String, trim: true, select: false },
    token: { type: String, select: false },
    is_admin: {type: Boolean, default: false},
    is_approve: {type: Boolean, default: false},
    avatar: { type: String, trim: true, default: "https://i.pravatar.cc/128" },
    mail_to: { type: String, unique: true, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, {
    versionKey: false
});

userSchema.pre('save', next => {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model("user", userSchema);