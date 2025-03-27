const { allowListModel } = require("../../../Models/allowedPlayersModel.js");
const { fetchPlayerUuidByUsername } = require("../../../Utils/fetching/fetchPlayerInfo.js");
const { EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
	name: "removewhitelist",
	aliases: [],
	category: "allowlist",
	utilisation: "removewhitelist <player_username>",
	description: "Removes a player from the whitelist",
	options: [
		{
			name: "player_username",
			description: "Username of the player to remove from the whitelist",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],

	async execute(interaction, interactionAuthorID, interactionGuildID) {
		try {
			const username = interaction.options.getString("player_username");
			
			// Fetch the player's UUID
			const playerUuid = await fetchPlayerUuidByUsername(username);
			
			// Check if player is in allowlist
			const isInAllowlist = await allowListModel.includeCheck(playerUuid);
			if (!isInAllowlist) {
				return await interaction.reply({
					content: `Player ${username} is not in the allowlist!`,
					flags: MessageFlags.Ephemeral
				});
			}

			// Remove player from allowlist
			await allowListModel.pull(playerUuid);

			// Create embed response
			const embed = new EmbedBuilder()
				.setTitle("Player Removed from Allowlist")
				.setColor("Red")
				.addFields(
					{ name: "Username", value: username, inline: true },
					{ name: "UUID", value: playerUuid, inline: true },
					{ name: "Removed By", value: `<@${interactionAuthorID}>`, inline: true }
				)
				.setTimestamp();

			await interaction.reply({ 
				embeds: [embed], 
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			console.error("Error in removewhitelist command:", error);
			await interaction.reply({
				content: "Failed to remove player from allowlist. Make sure the username is valid and try again.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}