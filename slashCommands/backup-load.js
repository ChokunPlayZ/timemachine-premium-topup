const backup = require('discord-backup');
const Discord = require('discord.js');
const backupsModel = require('../lib/backupsModel');
var sanitize = require('mongo-sanitize');

module.exports = {
    name: 'backup-load',
    description: 'load backup',
    async execute (config ,client, interaction, serverdata){

        if (interaction.guild.ownerId !== interaction.member.id){
            interaction.editReply(`คุณต้องเป็นเจ้าของเชิฟเวอร์หรือแอดมินที่เชื่อถือได้เพื่อที่จะใช้คำสั่งนี้`);
            return;
        }
        const slashoptions = interaction.options._hoistedOptions[0]
        const backupID = slashoptions.value;

        if (slashoptions.value) {
            interaction.editReply({ embeds:[
                new Discord.MessageEmbed()
                .setTitle(config.emoji.info+" ข้อมูล")
                .setColor(config.color.info)
                .setDescription(`การใช้งาน \n\n ${config.prefix} backup-load [backup-id] \n`)
                .setFooter(config.embed.footer)
                .setTimestamp()
            ] })
            return;
        }

        getbackup0 = await backupsModel.find({ "backup_id": sanitize(backupID), "backup_owner": interaction.member.id });
        const getbackup = getbackup0[0]

        if (!getbackup) {
            return interaction.editReply(config.emoji.error+' ไม่เจอ Backup '+backupID+'!');
        }

        interaction.editReply({embeds: [
            new Discord.MessageEmbed()
            .setTitle(config.emoji.warning+' คำเตือน')
            .setColor(config.color.warning)
            .setDescription('การกระทำต้อไปนี้ไม่สามารถย้อนกลับได้ \n\n - บทบาททั้งหมดจะถูกลบ\n- ห้องทั้งหมดจะถูกลบ\n- บอทจะสร้างยศใหม่\n- บอทจะสร้างห้องใหม่\n- การตั้งค่าเชิฟเวอร์จะถุกเปลี่ยน')
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
            time: 600000,
            max: 1
        });

        collector.on('collect', async i => {
            collector.stop();
            if (i.customId === 'confirm') {

                await i.update({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+' กรุณารอ')
                    .setDescription('กำลังโหลด Backup')
                    .setColor(config.color.info)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                ], components:[]});

                backup.load(getbackup.backup_data, interaction.guild).then(() => {
                    return;
            
                }).catch((err) => {

                    interaction.editReply("error")
                    console.log(err);
                    return
                    
                });

            } else {
                i.update({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+' ข้อมูล')
                    .setDescription('การโหลด Backup ถูกยกเลิกแล้ว.\n\nลองอีกครั้ง.')
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
                return
            }
        });
    }

};
