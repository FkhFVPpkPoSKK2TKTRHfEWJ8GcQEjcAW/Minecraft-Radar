const { allowListModel } = require("../../../Models/allowedPlayersModel.js");
const { fetchPlayerUuidByUsername } = require("../../../Utils/fetching/fetchPlayerInfo.js");
const { EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
	name: "addwhitelist",
	aliases: [],
	category: "allowlist",
	utilisation: "addwhitelist <player_username>",
	description: "Adds a player to the whitelist",
	options: [
		{
			name: "player_username",
			description: "Username of the player to add to the whitelist",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],

	async execute(interaction, interactionAuthorID, interactionGuildID) {
		try {
			const username = interaction.options.getString("player_username");
			
			// Fetch the player's UUID
			const playerUuid = await fetchPlayerUuidByUsername(username);
			
			// Check if player is already in allowlist
			const isInAllowlist = await allowListModel.includeCheck(playerUuid);
			if (isInAllowlist) {
				return await interaction.reply({
					content: `Player ${username} is already in the allowlist!`,
					flags: MessageFlags.Ephemeral
				});
			}

			// Add player to allowlist
			await allowListModel.push(playerUuid);

			// Create embed response
			const embed = new EmbedBuilder()
				.setTitle("Player Added to Allowlist")
				.setColor("Green")
				.addFields(
					{ name: "Username", value: username, inline: true },
					{ name: "UUID", value: playerUuid, inline: true },
					{ name: "Added By", value: `<@${interactionAuthorID}>`, inline: true }
				)
				.setTimestamp();

			await interaction.reply({ 
				embeds: [embed], 
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			console.error("Error in addwhitelist command:", error);
			await interaction.reply({
				content: "Failed to add player to allowlist. Make sure the username is valid and try again.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}