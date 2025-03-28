const { allowListModel } = require("../../../Models/allowedPlayersModel.js");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const { Pagination } = require("pagination.djs");
const { fetchPlayerUsernameByUuid } = require("../../../Utils/fetching/fetchPlayerInfo.js");

module.exports = {
	name: "viewwhitelist",
	aliases: [],
	category: "allowlist",
	utilisation: "viewwhitelist",
	description: "View all players in the whitelist",
	options: [],

	async execute(interaction, interactionAuthorID, interactionGuildID) {
		try {
			// Fetch current allowlist
			const currentAllowlist = await allowListModel.fetch() || [];
			
			if (currentAllowlist.length === 0) {
				return await interaction.reply({
					content: "The allowlist is empty!",
					flags: MessageFlags.Ephemeral
				});
			}

			// Fetch usernames for all UUIDs
			const playerInfo = await Promise.all(
				currentAllowlist.map(async (uuid) => {
					try {
						const username = await fetchPlayerUsernameByUuid(uuid);
						return { uuid, username };
					} catch (error) {
						console.error(`Error fetching username for UUID ${uuid}:`, error);
						return { uuid, username: "Unknown Player" };
					}
				})
			);

			// Create pages array
			const pages = [];
			const itemsPerPage = 10;
			const pagination = new Pagination(interaction, { ephemeral: true });
			const totalPages = Math.ceil(playerInfo.length / itemsPerPage);

			// Create a page for each set of 10 users
			for (let i = 0; i < totalPages; i++) {
				const startIndex = i * itemsPerPage;
				const endIndex = Math.min(startIndex + itemsPerPage, playerInfo.length);
				const pageUsers = playerInfo.slice(startIndex, endIndex);

				const embed = new EmbedBuilder()
					.setTitle("Allowlist Players")
					.setColor("Blue")
					.setDescription(`Showing players ${startIndex + 1} to ${endIndex} of ${playerInfo.length}`)
					.addFields(
						{ 
							name: "Players", 
							value: pageUsers.map((player, index) => 
								`${startIndex + index + 1}. ${player.username} (${player.uuid})`
							).join("\n")
						}
					)
					.setFooter({ text: `Page ${i + 1}/${totalPages}` })
					.setTimestamp();

				pages.push(embed);
			}

			pagination.setTimestamp();

			// Set footer with page numbers
			pagination.setEmbeds(pages, (embed, index, array) => {
				return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
			});

			pagination.render();
		} catch (error) {
			console.error("Error in viewwhitelist command:", error);
			await interaction.reply({
				content: "Failed to view the allowlist. Please try again later.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}

