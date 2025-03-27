const { DiscordConfigurations } = require("../../../configurations/discordClient.js")

module.exports.sendSpecificChannel = async (channelId, messageContent) => {
	try {
		const channelToSend = await DiscordClient.channels.fetch(channelId);
		await channelToSend.send(messageContent);
	} catch (error) {
		console.error("Error sending direct message:", error);
	}
}

module.exports.sendBotChannel = async (messageContent) => {
	try {
		const channelId = DiscordConfigurations.flagChannel;
		const channelToSend = await DiscordClient.channels.fetch(channelId);
		await channelToSend.send(messageContent);
	} catch (error) {
		console.error("Error sending direct message:", error);
	}
}