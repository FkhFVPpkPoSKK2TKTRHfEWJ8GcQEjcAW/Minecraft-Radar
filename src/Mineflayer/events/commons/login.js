const { sendBotChannel } = require("../../../Utils/Discord/sendChannelMessage.js");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = async () => {
	console.log(`logged in: ${new Date().toString()}\n`);

	const embed = new EmbedBuilder();
	embed
		.setTitle("Bot Has Logged in")
		.setColor("Green")
		.setTimestamp();

	sendBotChannel({ embeds: [embed] });
};