const { allowListModel } = require("../../../Models/allowedPlayersModel.js");
const { EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "clearwhitelist",
	aliases: [],
	category: "allowlist",
	utilisation: "clearwhitelist",
	description: "Removes all players from the whitelist",
	options: [],

	async execute(interaction, interactionAuthorID, interactionGuildID) {
		try {
			// Fetch current allowlist to get count
			const currentAllowlist = await allowListModel.fetch() || [];
			const playerCount = currentAllowlist.length;

			if (playerCount === 0) {
				return await interaction.reply({
					content: "The allowlist is already empty!",
					flags: MessageFlags.Ephemeral
				});
			}

			// Clear the allowlist
			await allowListModel.clear();

			// Create success embed
			const embed = new EmbedBuilder()
				.setTitle("Allowlist Cleared")
				.setColor("Red")
				.setDescription(`Successfully removed all ${playerCount} players from the allowlist`)
				.addFields(
					{ name: "Players Removed", value: playerCount.toString(), inline: true },
					{ name: "Cleared By", value: `<@${interactionAuthorID}>`, inline: true }
				)
				.setTimestamp();

			await interaction.reply({ 
				embeds: [embed], 
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			console.error("Error in clearwhitelist command:", error);
			await interaction.reply({
				content: "Failed to clear the allowlist. Please try again later.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}