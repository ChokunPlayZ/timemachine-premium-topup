const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');


// Place your client and guild ids here
const clientId = '901002772017741866';
const guildId = '900302853070028811';

const commands = [
	new SlashCommandBuilder()
	.setName('get-premium')
	.setDescription('สร้าง Backup ของเชิฟเวอร์นี้')
	.addStringOption(option =>
		option.setName('tmw-gift')
		.setDescription('ลิงค์อั่งเปา truemoney wallet')
		.setRequired(true)),

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
	.setDescription('ดูข้อมูลของบอททั้งหมด'),

	new SlashCommandBuilder()
	.setName('premium')
	.setDescription('แสดงสถานะพรีเมี่ยม'),

	new SlashCommandBuilder()
	.setName('auto-backup')
	.setDescription('เปิด/ปิด Backup อัตโนมัติ')
	.addSubcommand(subcommand => subcommand
			.setName('on')
			.setDescription('เปิดสำรองข้อมูลอัตโนมัติ')
			.addStringOption(option =>
				option.setName('tmw-gift')
				.setDescription('ลิงค์อั่งเปา truemoney wallet')
				.setRequired(true)))
	.addSubcommand(subcommand => subcommand
		.setName('off')
		.setDescription('ปิดสำรองข้อมูลอัตโนมัติ'))
]
	.map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

