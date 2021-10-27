const Discord = require('discord.js');
const backupsModel = require('../lib/backupsModel');
var sanitize = require('mongo-sanitize');

module.exports = {
    name: 'backup-delete',
    description: 'delete backup',
    async execute (config ,client, interaction, serverdata ){

        const slashoptions = interaction.options._hoistedOptions[0]
        const backupID = slashoptions.value;

        getbackup0 = await backupsModel.find({ "backup_id": sanitize(backupID), "backup_owner": interaction.member.id });
        const getbackup = getbackup0[0]


        if (!getbackup) {
            return interaction.editReply(' ไม่เจอ Backup '+backupID+'!');
        }

        interaction.editReply({embeds: [
            new Discord.MessageEmbed()
            .setTitle(config.emoji.warning+' คำเตือน')
            .setDescription('การกระทำต้อไปนี้ไม่สามารถย้อนกลับได้ \n\n - Backup จะถูกลบ')
            .setColor(config.color.warning)
            .setFooter(config.embed.footer)
            .setTimestamp()
        ], components:[
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('confirm')
                    .setLabel('ยืนยัน')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('cancel')
                    .setLabel('ยกเลิก')
                    .setStyle('DANGER'),
            )
        ]});

        const filter = i => i.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({ 
            filter, 
            time: 60000,
            max: 1
        });

        collector.on('collect', async i => {
            collector.stop();
            if (i.customId === 'confirm') {

                await i.update({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+' กรุณารอ')
                    .setDescription('กำลังลบ Backup')
                    .setColor(config.color.info)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                ], components:[]});
                
                await backupsModel.deleteOne({ "backup_id": sanitize(backupID), "backup_owner": interaction.member.id }, function (err) {
                    if(err) console.log(err);
                    i.editReply({embeds: [
                        new Discord.MessageEmbed()
                        .setTitle(config.emoji.success+' เสร็จสิ้น')
                        .setDescription('ลบ Backup เสร็จสิ้น')
                        .setColor(config.color.success)
                        .setFooter(config.embed.footer)
                        .setTimestamp()
                    ]});
                  }).clone();

            } else {
                i.update({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+' ข้อมูล')
                    .setDescription('การลบ Backup ถูกยกเลิกแล้ว.')
                    .setColor(config.color.info)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                ], components:[]});
                return
            }
        });

        collector.on('end', (reason, i) => {
            if (reason === 'time') {
                i.update({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+' ข้อมูล')
                    .setDescription('หมดเวลาตัดสินใจ.\n\nกรุณาลองใหม่อีกครัง.')
                    .setColor(config.color.info)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                ], components:[]});
                return;
            }
        });
    }
};
