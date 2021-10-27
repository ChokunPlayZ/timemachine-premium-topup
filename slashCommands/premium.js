const Discord = require('discord.js');
const premiumModel = require('../lib/premiumModel');

module.exports = {
    name: 'premium',
    description: 'get server premium info',
    async execute (config ,client, interaction, serverconfig){

        getpremium0 = await premiumModel.find({"server_id": interaction.guildId });
        const getpremium = getpremium0[0];

        if (getpremium) {
            interaction.editReply({ embeds:[
                new Discord.MessageEmbed()
                .setTitle("Time Machine Premium")
                .setDescription("สถานะ premium ของเชิฟเวอร์ "+ interaction.member.guild.name)
                .setColor(config.color.info)
                .addFields(
                    {name: "สถานะ premium", value: "activated", inline: false},
                    {name: "วันหมดอายุ", value: getpremium.expire+" ", inline: false}
                    // {name: "", value: "", inline: false}
                )
            ]});
        } else {
            interaction.editReply("You Don't have premium access");
        }
    }
};