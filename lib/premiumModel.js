var mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
    "user_id": { type: String, require: true, unique: true },
    "expire": { type: String },
    "permanent": { type: String },
})

const model = mongoose.model("premium_users", premiumSchema);

module.exports = model;