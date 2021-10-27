const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');


// Place your client and guild ids here
const clientId = '900273369386197002';

const commands = [
	new SlashCommandBuilder()
	.setName('backup-create')
	.setDescription('สร้าง Backup ของเชิฟเวอร์นี้'),

	new SlashCommandBuilder()
	.setName('backup-list')
	.setDescription('แสดง Backup ทั้งหมดที่เคยสร้างใว้'),

	new SlashCommandBuilder()
	.setName('backup-load')
	.setDescription('โหลด Backup เข้าเชิฟเวอร์')
	.addStringOption(option => 
		option.setName('backup-id')
			.setDescription('Backup Id ที่บอทให้ตอนสำรองข้อมูลเชิฟเวอร์')
			.setRequired(true)),
	
	new SlashCommandBuilder()
	.setName('backup-delete')
	.setDescription('ลบ Backup ที่เคยสร้างใว้ (ไม่สามารถกู้คืนได้)')
	.addStringOption(option => 
		option.setName('backup-id')
			.setDescription('Backup Id ที่บอทให้ตอนสำรองข้อมูลเชิฟเวอร์')
			.setRequired(true)),

	new SlashCommandBuilder()
	.setName('backup-purge')
	.setDescription('ลบ Backup ที่เคยสร้างใว้ทั้งหมด'),

	new SlashCommandBuilder()
	.setName('info')
	.setDescription('ดูข้อมูลของบอททั้งหมด')
]
	.map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(config.token_release);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

