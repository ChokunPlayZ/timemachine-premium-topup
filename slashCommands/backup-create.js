const config = require('../config.json');
const backup = require('discord-backup');
const Discord = require('discord.js');
var mongoose = require('mongoose');
const backupsModel = require('../lib/backupsModel');
var sanitize = require('mongo-sanitize');

module.exports = {
    name: 'backup-create',
    description: 'create backup',
    async execute (config ,client, interaction, serverdata){

        if(!interaction.member.permissions.has('MANAGE_GUILD')){
            return interaction.editReply(config.emoji.error+' คุณต้องมี permission ผู้ดูแลในการใช้คำสั่งนี้.');
        }

        getbkamount = await backupsModel.find({ "backup_owner": interaction.member.id });

        if(getbkamount.length > 19) {
            await interaction.editReply({embeds: [
                new Discord.MessageEmbed()
                .setTitle(config.emoji.error+' เกิดข้อผิดพลาด')
                .setDescription('\n ตอนนี้ยังสามารถสร้างได้แค่คนละ 20 Backup นะครับ\n/backup-list เพื่อดู Backup ทั้งหมด')
                .setColor(config.color.error)
                .setFooter(config.embed.footer)
                .setTimestamp()
            ]});
            return;
        }

        await interaction.editReply({embeds: [
            new Discord.MessageEmbed()
            .setTitle(config.emoji.loading+' โปรดรอ')
            .setDescription('กำลังสร้าง Backup')
            .setColor(config.color.info)
            .setFooter(config.embed.footer)
            .setTimestamp()
        ]});

        backup.create(interaction.guild, {
            maxMessagesPerChannel: 20,
            jsonSave: false,
            jsonBeautify: false,
            doNotBackup: [],
            saveImages: "base64"
        }).then( async (backupData) => {

            let date = new Date();

            let backups = await backupsModel.create({
                "backup_id": sanitize(backupData.id),
                "server_id": sanitize(interaction.guildId),
                "backup_owner": sanitize(interaction.member.id),
                "backup_time": date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok'}),
                "backup_type": "manual",
                "backup_data": sanitize(backupData)
            })

            backups.save();
            
            interaction.editReply({embeds: [
                new Discord.MessageEmbed()
                .setTitle(config.emoji.success+' สำเร็จ')
                .setDescription("สร้าง Backup `"+backupData.id+"` เสร็จสิ้น")
                .setColor(config.color.success)
                .addFields(
                    {name:"การใช้งาน", value:"โหลด Backup```/backup-load "+backupData.id+"```\nลบ Backup```/backup-delete "+backupData.id+"```"}
                )
                .setFooter(config.embed.footer)
                .setTimestamp()
            ]});

            return;

        }).catch((err) => {

            console.log(err);
            return interaction.editReply({ content:config.emoji.error+" เกิดข้อผิดพลาด!", embeds:[], components:[]});

        });

    }
};
