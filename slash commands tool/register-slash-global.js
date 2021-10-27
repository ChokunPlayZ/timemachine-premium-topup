const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');


// Place your client and guild ids here
const clientId = '902733592705261639';

const commands = [
	new SlashCommandBuilder()
	.setName('premium')
	.setDescription('คำสั่ง premium ของบอท timemachine premium')
	.addSubcommand(subcommand => subcommand
			.setName('topup')
			.setDescription('เติม premium')
			.addStringOption(option =>
				option.setName('tmw-gift')
				.setDescription('ลิงค์อั่งเปา truemoney wallet')
				.setRequired(true)))
	.addSubcommand(subcommand => subcommand
		.setName('info')
		.setDescription('ดูสถานะ premium ของคุณ'))
]
	.map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

