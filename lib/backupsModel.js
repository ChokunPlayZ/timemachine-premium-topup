var mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
    "backup_id": { type: String },
    "server_id": { type: String },
    "backup_owner": { type: String },
    "backup_time": { type: String},
    "backup_type": { type: String},
    "backup_data": { type: Object }
});

const model = mongoose.model("backups", backupSchema);

module.exports = model;