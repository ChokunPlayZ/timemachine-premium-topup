const Discord = require('discord.js');
const premiumModel = require('../lib/premiumModel');
const twApi = require('../lib/tmw_api')

module.exports = {
    name: 'premium',
    description: 'top up and see premium info',
    async execute (config ,client, interaction, serverconfig){

        if (interaction.options._subcommand == "topup") {

            interaction.editReply({embeds: [
                new Discord.MessageEmbed()
                .setTitle(config.emoji.warning+' คำเตือน')
                .setColor(config.color.warning)
                .setDescription('การกระทำต้อไปนี้ไม่สามารถย้อนกลับได้ \n\n - คูปองจะถูกใช้\n\nการกระทำหลังจากนี้จะไม่สามารถย้อนกลับได้\nเราจะไม่คืนเงิน**ทุกกรณี**\nการกดปุ่มตกลงหมายความว่าท่านเข้าใจข้อความแล้ว')
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
                        .setDescription('กำลังเติมเงิน กรุณารอ')
                        .setColor(config.color.info)
                        .setFooter(config.embed.footer)
                        .setTimestamp()
                    ], components:[]});

                    const data = await twApi(interaction.options._hoistedOptions[0].value, "0635414659");

                    switch (data.status.code) {
                        case "SUCCESS":
                            console.log(data.data.my_ticket.amount_baht);
                            if ("100" == "100") {
                                await i.editReply({embeds: [
                                    new Discord.MessageEmbed()
                                    .setTitle(config.emoji.success+' เติมเงินสำเร็จ')
                                    .setDescription('เติมเงินสำเร็จ \nระบบจะใช้เวลาอับเดตประมาณ 5 นาที\nใช้ /premium ในบอท Time Machine เพื่อดูสถานะ Premium ของคุณ')
                                    .setColor(config.color.success)
                                    .setFooter(config.embed.footer)
                                    .setTimestamp()
                                ], components:[]});
                                getpremium = await premiumModel.find({"user_id": interaction.user.id });
                                getpremium = await premiumModel.find({"user_id": interaction.user.id });
                                if (getpremium[0]) {
                                    var oldd = Number(getpremium[0].expire);
                                    var olddate = new Date(oldd);
                                    var new_expire = new Date(olddate).setDate(olddate.getDate()+30);
                                    await premiumModel.findOneAndUpdate({
                                            "user_id": interaction.user.id,
                                            "expire": new_expire
                                    })
                                } else {
                                    var date = new Date();
                                    var new_expire = new Date(date).setDate(date.getDate()+30);
                                    await premiumModel.create({
                                        "user_id": interaction.user.id,
                                        "expire": new_expire
                                    })
                                }
                            } else {
                                await i.editReply({embeds: [
                                    new Discord.MessageEmbed()
                                    .setTitle(config.emoji.error+' ผิดพลาด')
                                    .setDescription('ไม่สามารถเติมได้ \nจำนวนเงินไม่พอ\nเราจะไม่คืนเงินทุกกระณีตามที่ระบุใว้ในข้อความก่อนหน้านี้')
                                    .setColor(config.color.error)
                                    .setFooter(config.embed.footer)
                                    .setTimestamp()
                                ], components:[]});
                            }
                            break;
                        case "CANNOT_GET_OWN_VOUCHER":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nไม่สามารถใช้ลิงค์ตัวเองได้')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "TARGET_USER_NOT_FOUND":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nไม่พบเบอร์นี้ในระบบ')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "INTERNAL_ERROR":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nไม่ซองนี้ในระบบ หรือ URL ผิด')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "VOUCHER_OUT_OF_STOCK":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nมีคนรับไปแล้ว')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "VOUCHER_NOT_FOUND":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nไม่พบซองในระบบ')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "VOUCHER_EXPIRED":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nซองวอเลทนี้หมดอายุแล้ว')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        case "TARGET_USER_REDEEMED":
                            await i.editReply({embeds: [
                                new Discord.MessageEmbed()
                                .setTitle(config.emoji.error+' ผิดพลาด')
                                .setDescription('ไม่สามารถเติมได้ \nลืงค์นี้ถูกใช้ไปแล้ว')
                                .setColor(config.color.error)
                                .setFooter(config.embed.footer)
                                .setTimestamp()
                            ], components:[]});
                            break;
                        default:
                            console.log(data);
                            break;
                    }

                    // 
    
                } else {
                    i.update({embeds: [
                        new Discord.MessageEmbed()
                        .setTitle(config.emoji.info+' ข้อมูล')
                        .setDescription('การเติม ถูกยกเลิกแล้ว.\n\nใช้ /premium topup เพื่อลองอีกครั้ง.')
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
            return;
        }
        if (interaction.options._subcommand == "info") {
            getpremium = await premiumModel.find({"user_id": interaction.member.id });
            if (getpremium[0]) {
                var oldd = Number(getpremium[0].expire);
                var premiumexpire = new Date(oldd);
                interaction.editReply({ embeds:[
                    new Discord.MessageEmbed()
                    .setTitle("Time Machine Premium")
                    .setDescription("สถานะ premium ของคุณ "+ interaction.user.username)
                    .setColor(config.color.info)
                    .addFields(
                        {name: "สถานะ premium", value: "activated", inline: false},
                        {name: "วันหมดอายุ", value: premiumexpire+" ", inline: false}
                        // {name: "", value: "", inline: false}
                    )
                ]});
                return;
            } else {
                interaction.editReply("คุณไม่มี premium คุณสามารถชื้อ premium ได้ที่  [Support Discord](https://discord.gg/M8GrEeZAcz)\n\nสิ่งที่คุณจะได้จาก Time Machine Premium \n- เก็บ Backup ได้ถึง 100 Backup\n- สามารถ ตั้ง Auto Backup ได้ถี่ขึ้น\n- และพีเจอร์อีกมากมายที่จะมาในอณาคต");
                return;
            }
        }
        await interaction.editReply({ content:"เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนา" })
    }
};