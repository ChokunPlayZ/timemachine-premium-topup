const config = require('../config.json');
const backup = require('discord-backup');
const Discord = require('discord.js');
var mongoose = require('mongoose');
const backupsModel = require('../lib/backupsModel');
var sanitize = require('mongo-sanitize');

module.exports = {
    async runBackup (client, hrbackup) {

        const guildData = client.guilds.cache.get(hrbackup.server_id);

        getbackup = await backupsModel.find({ "backup_owner": hrbackup.autobackup_owner, "server_id": hrbackup.server_id, "backup_type": "auto" });

        if (getbackup.length > hrbackup.autobackup_limit) {
            await backupsModel.deleteOne({ "backup_owner": hrbackup.autobackup_owner, "server_id": hrbackup.server_id, "backup_type": "auto" });
        }
        backup.create(guildData, {
            maxMessagesPerChannel: 20,
            jsonSave: false,
            jsonBeautify: false,
            doNotBackup: [],
            saveImages: "base64"
        }).then( async (backupData) => {

            let date = new Date();

            let backups = await backupsModel.create({
                "backup_id": backupData.id,
                "server_id": hrbackup.server_id,
                "backup_owner": hrbackup.autobackup_owner,
                "backup_time": date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok'}),
                "backup_type": "auto",
                "backup_data": backupData
            })

            backups.save();

        }).catch((err) => {

            console.log(err);
            console.log("Error");

        });
    }
}
