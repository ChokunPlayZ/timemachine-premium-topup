const {Client, Intents, Collection} = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
require('log-timestamp');
const premiumModel = require('./lib/premiumModel');
const cron = require('node-cron');

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
			name: 'subscriptions',
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
    client.user.setActivity('Subscriptions', { type: 'WATCHING' });
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

        await interaction.deferReply({ephemeral: true});

        try{
            client.slashCommands.get(interaction.commandName).execute(config ,client, interaction);
        } catch (error) {
            console.error(error);
            interaction.editReply('เกิดข้อผิดพลาด กรุณาติดต่อผู้พัฒนาที่ [Support Discord](https://discord.gg/M8GrEeZAcz)')
        }
    }
})

cron.schedule('* * * * *', async function() {
    getpremium = await premiumModel.find({});
    
    for (const premium of getpremium) {
        if(premium.expire < Date.now()) {
            await premiumModel.findOneAndDelete({"user_id": premium.user_id })
        }
    }
});

loadmongo();
client.login(config.token);