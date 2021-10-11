const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    mail_to: { type: String, default: "admin@seiwa-pioneer.com" },
    mail_cc: { type: String, default: null },
    mail_bc: { type: String, default: null },
    is_status: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, {
    versionKey: false
});

departmentSchema.pre('save', next => {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model("tbt_departments", departmentSchema);