const {Client, Intents, Collection} = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('log-timestamp');
const serverModel = require('./lib/serverModel');
const autobackupModel = require('./lib/autobackupModel');
const autobackup = require("./workers/backup-worker")

const myIntents = new Intents();
myIntents.add();

const client = new Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS, 
        Discord.Intents.FLAGS.GUILD_MESSAGES, 
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
        Discord.Intents.FLAGS.DIRECT_MESSAGES, 
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
     presence: {
		status: 'online',
		activity: {
			name: 'printers',
			type: 'WATCHING'
		}
	}
});
const config = require('./config.json');

async function loadmongo() {
    await mongoose.connect(config.mongodbURI, { useNewUrlParser: true , useUnifiedTopology: true});
    console.log("Mongodb Connected!");
}

const nl = "\n"

client.once('ready' , () => {
    console.log(`${client.user.tag} is online !`);
    client.user.setActivity('Server Backups', { type: 'WATCHING' });
})

console.log("------------- LOADING SHASH COMMANDS ------------------------");

client.slashCommands = new Collection()
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${file}`);
    client.slashCommands.set(slashCommand.name, slashCommand);
    console.log(`Loaded ${file}`);
}

// INTERACTION

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        // return;

        //const command = client.commands.get(interaction.commandName);

        //if (!command) return;

        await interaction.deferReply();

        getserver0 = await serverModel.find({ "server_id": interaction.guildId }).catch((error) => {
            console.error(error);
            interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)');
        });;
        const getserver = getserver0[0]

        if (!getserver) {
            let createserver = await serverModel.create({
                "server_id": interaction.guildId,
                "server_prefix": "!tm",
                "server_type": "normal",
                "backup_interval": "off",
                "trusted_admin": []
            })
            createserver.save();
        }

        try{
            client.slashCommands.get(interaction.commandName).execute(config ,client, interaction, getserver);
        } catch (error) {
            console.error(error);
            interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)')
        }
    }
})

// load job

const checkForAutoBackup = async (interval) => {
    hrbackup = await autobackupModel.find({ "backup_interval": interval }).catch((error) => {
        console.error(error);
    });
    for (const backup of hrbackup) {
        autobackup.runBackup(client, backup)
    }
}

cron.schedule('* * * * *', async function() {
    checkForAutoBackup("1h");
});

loadmongo();
client.login(config.token);