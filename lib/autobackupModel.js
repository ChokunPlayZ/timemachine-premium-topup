var mongoose = require('mongoose');

const autobackupSchema = new mongoose.Schema({
    "server_id": { type: String, require: true, unique: true },
    "backup_interval": { type: String},
    "autobackup_owner": { type: String},
    "autobackup_limit": { type: String }
});

const model = mongoose.model("auto_backup", autobackupSchema);

module.exports = model;