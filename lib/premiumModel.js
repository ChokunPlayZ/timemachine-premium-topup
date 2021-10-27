var mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
    "server_id": { type: String, require: true, unique: true },
    "expire": { type: String },
    "permanent": { type: String },
    "activated_by": { type: String }
})

const model = mongoose.model("premium", premiumSchema);

module.exports = model;