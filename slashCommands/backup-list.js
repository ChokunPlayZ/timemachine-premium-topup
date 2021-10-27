const Discord = require('discord.js');
const backupsModel = require('../lib/backupsModel');

module.exports = {
    name: 'backup-list',
    description: 'list backups',
    async execute (config ,client, interaction, serverdata){
        // If the member doesn't have enough permissions

        getbackup = await backupsModel.find({ "backup_owner": interaction.member.id });

        if (getbackup.length < 1) {
            interaction.editReply({ embeds:[
                new Discord.MessageEmbed()
                .setTitle(config.emoji.info+" ข้อมูล")
                .setColor(config.color.info)
                .setDescription("คุณไม่มี Backup!")
                .setFooter(config.embed.footer)
                .setTimestamp()
            ] })
            return;
        }

        var bklist  = getbackup.map((entry) => { 
            return { name: entry.backup_id, value: `${entry.backup_data.name} (\`${entry.backup_time}\`)`, inline: false }
        })

        interaction.editReply({ embeds:[
            new Discord.MessageEmbed()
            .setTitle(config.emoji.info+" ข้อมูล")
            .setColor(config.color.info)
            .setDescription("Backup ทั้งหมดของคุณ")
            .addFields(bklist)
            .setFooter(config.embed.footer)
            .setTimestamp()
        ] })
    }
};
