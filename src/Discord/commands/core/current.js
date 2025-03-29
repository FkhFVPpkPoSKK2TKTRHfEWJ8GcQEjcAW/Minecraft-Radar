const { EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
	name: "currentlocation",
	aliases: [],
	category: "core",
	utilisation: "currentlocation",
	description: "sends current location",

	async execute(interaction, interactionAuthorID, interactionGuildID) {
		try {
			const { latestBotLocation } = require("../../../Utils/Mineflayer/getDistanceFromPlayer.js").playerLocationTracker;
			
			if (!latestBotLocation) {
				return await interaction.reply({
					content: "Bot location is currently unavailable.",
					flags: MessageFlags.Ephemeral
				});
			}

			const embed = new EmbedBuilder()
				.setTitle("Here is the current location.")
				.setColor("Green")
				.setDescription(`Location: X: ${Math.round(latestBotLocation.x)}, Y: ${Math.round(latestBotLocation.y)}, Z: ${Math.round(latestBotLocation.z)}`)
				.setTimestamp();

			await interaction.reply({ 
				embeds: [embed], 
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			console.error("Error in currentlocation command:", error);
			await interaction.reply({
				content: "Failed to list current location.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}