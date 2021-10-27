const Discord = require('discord.js');
const premiumModel = require('../lib/premiumModel');
const serverModel = require('../lib/serverModel');
const backupsModel = require('../lib/backupsModel');
const autobackupModel = require('../lib/autobackupModel');

module.exports = {
    name: 'auto-backup',
    description: 'configure autobackup',
    premium: false,
    async execute (config ,client, interaction, serverdata){

        const slashanswer = interaction.options._hoistedOptions

        if (interaction.options._subcommand == "on") {

            const premium_interval = ["1h" , "6h", "12h"]
            const type_allowed = ["premium", "dev"]

            if (!serverdata.server_type == "premium" || serverdata.server_type == "dev") {
                if (premium_interval.includes(slashanswer[0].value)) {
                    getuser0 = await premiumModel.find({ "server_id": interaction.guildId }).catch((error) => {
                        console.error(error);
                        interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
                        return;
                    });
                    if (!getuser0[0]) {
                        interaction.editReply({ embeds:[
                            new Discord.MessageEmbed()
                            .setTitle(config.emoji.error+" ผิดพลาด")
                            .setColor(config.color.error)
                            .setDescription("ไม่สามารถใช้เวลาที่ตั้งได้ \nเวลาที่เลือกสามารถใช้ได้ในเชิฟเวอร์ premium เท่านั้น \n/premium เพื่อดูข้อมูล premium")
                            .setFooter(config.embed.footer)
                        ] })
                        return;
                    }
                }
            }

            getserver0 = await autobackupModel.find({ "server_id": interaction.guildId }).catch((error) => {
                console.error(error);
                interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
            });
            const getserver = getserver0[0];
    
            if (!getserver) {
                let createconfig = await autobackupModel.create({
                    "server_id": interaction.guildId,
                    "backup_interval": slashanswer[0].value,
                    "autobackup_owner": interaction.member.id,
                    "autobackup_limit": slashanswer[1].value - 1
                }).catch((error) => {
                    console.error(error);
                    interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
                });
                createconfig.save();
            } else {
                await autobackupModel.updateOne({
                    "server_id": interaction.guildId,
                    "backup_interval": slashanswer[0].value,
                    "autobackup_owner": interaction.member.id,
                    "autobackup_limit": slashanswer[1].value
                }).catch((error) => {
                    console.error(error);
                    interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
                });
            }

            interaction.editReply({ embeds:[
                new Discord.MessageEmbed()
                .setTitle(config.emoji.success+" สำเร็จ")
                .setColor(config.color.success)
                .setDescription("ตั้งค่า Backup อัตโนมัติ เสร็จสิ้น")
                .addFields(
                    { name:"สถานะ", value:"เปิด Auto Backup แล้ว", inline:false},
                    { name:"ระยะห่างระหว่าง Backup", value:slashanswer[0].value, inline:false},
                    { name:"จำนวน Backup ที่จะเก็บใว้", value:slashanswer[1].value, inline:false}
                )
                .setFooter(config.embed.footer)
            ]})
            
            //interaction.editReply({ content:`option is on with ${slashanswer[0].value} of interval and with a limit of ${slashanswer[1].value}` });
        } else {
            getserver0 = await autobackupModel.find({ "server_id": interaction.guildId }).catch((error) => {
                console.error(error);
                interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
            });;
            const getserver = getserver0[0];
    
            if (!getserver) {
                interaction.editReply({ embeds:[
                    new Discord.MessageEmbed()
                    .setTitle(config.emoji.info+" ข้อความ")
                    .setColor(config.color.info)
                    .setDescription("Backup อัตโนมัติ ปิดอยู่แล้ว \nไม่มีการเปลี่ยนแปลง")
                    .setFooter(config.embed.footer)
                ]})
                return;
            } else {
                await autobackupModel.deleteOne({"server_id": interaction.guildId,}).catch( (err) => {
                    console.error(err);
                    interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
                    return;
                })
            }

            interaction.editReply({ embeds:[
                new Discord.MessageEmbed()
                .setTitle(config.emoji.success+" สำเร็จ")
                .setColor(config.color.success)
                .setDescription("ปิด Backup อัตโนมัติ เสร็จสิ้น")
                .addFields(
                    { name:"สถานะ", value:"ปิด Auto Backup แล้ว", inline:false}
                )
                .setFooter(config.embed.footer)
            ] })
        }
    }
};