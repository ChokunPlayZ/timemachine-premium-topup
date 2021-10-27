var mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    "user_id": { type: String, require: true, unique: true },
    "user_type": { type: String, default: "normal"},
    "max_backup": { type: String, default: "19"}
});

const model = mongoose.model("servers", serverSchema);

module.exports = model;