const Discord = require('discord.js');
const backupsModel = require('../lib/backupsModel');

module.exports = {
    name: 'info',
    description: 'get bot info',
    async execute (config ,client, interaction, getserver){

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        var uptime = (days + " วัน/ " + hours + " ชั่วโมง/ " + minutes + " นาที/ " + seconds + " วินาที")

        const userCount = client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c, 0);
        const guildsCount = client.guilds.cache.size;

        getbackup = await backupsModel.find({});

        interaction.editReply({ embeds: [
            new Discord.MessageEmbed()
            .setColor(config.color.info)
            .setTitle(config.emoji.info+" ข้อมูล")
            .setDescription('ข้อมูลของบอททั้งหมด')
            .addFields(
                { name: 'เวลาที่บอทรันมา', value: uptime, inline: false},
                { name: 'เชิฟเวอร์ทั้งหมดที่บอทอยู่', value: guildsCount+" เชิฟเวอร์", inline: false},
                { name: 'จำนวนผู้ใช้ทั้งหมดที่บอทเห็น', value: `${userCount} คน`, inline: false},
                { name: 'Backup ทั้งหมดในระบบ', value: `${getbackup.length} ไฟล์`, inline: false},
                { name: 'Ping', value: `${Math.round(client.ws.ping)} ms`, inline: false}
            )
            .setTimestamp()
            .setFooter(config.embed.footer)
        ]})
    }
};