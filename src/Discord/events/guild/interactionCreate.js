const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { buttonInteractionExpiry } = require("../../../../configurations/discordClient.js").DiscordConfigurations;
const paginationNamesCustomButtonIds = new Set(["paginate-first", "paginate-last", "paginate-next", "paginate-prev"]);

module.exports = async (bot, interactionCreate) => {
	if (interactionCreate.isChatInputCommand()) {
		try {
			let interactionAuthorID = interactionCreate.user.id;
			let interactionGuildID = interactionCreate.guild.id;
			const cmd = bot.commands.get(interactionCreate.commandName);
			if (!cmd) return;

			await cmd.execute(interactionCreate, interactionAuthorID, interactionGuildID);
		} catch (error) {
			console.error(error);
			if (interactionCreate.isRepliable()) {
				await interactionCreate.reply("Something went wrong, please try again later.");
			}
		}

	} else if (interactionCreate.isAutocomplete()) {
		const cmd = bot.commands.get(interactionCreate.commandName);
		if (!cmd) return;
		try {
			if (cmd.autocomplete) {
				await cmd.autocomplete(interactionCreate);
			}
		} catch (error) {
			console.error(error);
			if (interactionCreate.isRepliable()) {
				await interactionCreate.reply("Something went wrong with the autocomplete, please try again later.");
			}
		}

	} else if (interactionCreate.isButton()) {
		try {
			const interactionCustomId = interactionCreate.customId;

			// let the paginate.djs library handle this instead
			if(paginationNamesCustomButtonIds.has(interactionCustomId)) return;

			// regular buttons
			let buttonId = JSON.parse(interactionCustomId);
			let buttonFile = buttonId.ffb;
			if (!buttonFile) return;

			delete require.cache[require.resolve(`../../buttons/${buttonFile}.js`)];
			const button = require(`../../buttons/${buttonFile}.js`);

			if (button) {
				await button({ interactionCreate, buttonId });
			}

			// Set up a button collector to stop interactions after 15 minutes
			const message = await interactionCreate.message;
			const collector = message.createMessageComponentCollector({ time: buttonInteractionExpiry });

			collector.on("end", async () => {
				try {
					// Disable the button after time limit
					const disabledButton = new ButtonBuilder()
						.setCustomId(interactionCustomId)
						.setLabel("Expired")
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true);

					const disabledRow = new ActionRowBuilder().addComponents(disabledButton);

					await message.edit({ components: [disabledRow] });
				} catch (err) {
					console.error("Failed to disable button:", err);
				}
			});
		} catch (error) {
			console.error("Button error:", error);
		}
	}
};