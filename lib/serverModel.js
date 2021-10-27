var mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    "server_id": { type: String, require: true, unique: true },
    "server_prefix": { type: String, default: "!tm"},
    "server_type": { type: String, default: "normal"},
    "trusted_admin": { type: Object }
});

const model = mongoose.model("servers", serverSchema);

module.exports = model;