const { sendBotChannel } = require("../../../Utils/Discord/sendChannelMessage.js");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = () => {
	const { latestBotLocation } = require("../../../Utils/Mineflayer/getDistanceFromPlayer.js").playerLocationTracker;
	const embed = new EmbedBuilder()
		.setTitle("Bot Has Unexpectedly Died")
		.setDescription(
			latestBotLocation 
				? `Location: X: ${Math.round(latestBotLocation.x)}, Y: ${Math.round(latestBotLocation.y)}, Z: ${Math.round(latestBotLocation.z)}\n${process.env.DISCORD_MINEFLAYER_BOT_DEATH_MESSAGE}`
				: `Location: Unknown\n${process.env.DISCORD_MINEFLAYER_BOT_DEATH_MESSAGE}`
		)
		.setColor("Red")
		.setTimestamp();

	MineflayerBot.chat(process.env.MINECRAFT_CHAT_UPON_DEATH);
	sendBotChannel({ embeds: [embed] });
}