const { EmbedBuilder, ApplicationCommandOptionType, MessageFlags } = require("discord.js");

// Helper functions
const createHelpEmbed = (commandSize) => {
	return new EmbedBuilder()
		.setTimestamp()
		.setTitle("List of commands!")
		.setDescription(`This bot has ${commandSize} commands!`);
};

const getCategoryList = (commandCollection) => {
	const categories = new Set(commandCollection.map(cmd => cmd.category));
	return Array.from(categories);
};

const handleCategoryHelp = async (interaction, commandCollection, category) => {
	const categoryCommands = Array.from(commandCollection.values())
		.filter(cmd => cmd.category.toLowerCase() === category.toLowerCase());

	if (categoryCommands.length === 0) {
		return await interaction.reply({
			content: "No commands found in this category!",
			flags: MessageFlags.Ephemeral
		});
	}

	const helpEmbed = createHelpEmbed(commandCollection.size);
	helpEmbed.addFields({
		name: `Available commands in ${category}`,
		value: "`" + categoryCommands.map(cmd => cmd.name).join("`, `") + "`",
		inline: true
	});

	return await interaction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
};

const handleCommandHelp = async (interaction, commandCollection, commandName) => {
	const command = commandCollection.get(commandName) ||
		commandCollection.find(x => x.aliases && x.aliases.includes(commandName));

	if (!command) {
		return await interaction.reply({
			content: "Command not found!",
			flags: MessageFlags.Ephemeral
		});
	}

	const helpEmbed = createHelpEmbed(commandCollection.size);
	helpEmbed.addFields(
		{ name: "Name", value: command.name, inline: true },
		{ name: "Category", value: command.category, inline: true },
		{ name: "Alias(es)", value: command.aliases.length < 1 ? "None" : command.aliases.join(", "), inline: true },
		{ name: "Utilisation", value: command.utilisation, inline: true },
		{ name: "Description", value: command.description }
	);

	return await interaction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
};

// Command module
module.exports = {
	name: "help",
	aliases: [],
	category: "core",
	description: "Sends list of commands for this bot!",
	utilisation: "help <command/category>",
	options: [
		{
			name: "category",
			description: "Returns results for specific category.",
			type: ApplicationCommandOptionType.String,
			required: false,
			autocomplete: true
		},
		{
			name: "command",
			description: "Returns results for specific command!",
			type: ApplicationCommandOptionType.String,
			required: false,
			autocomplete: true
		}
	],

	async autocomplete(interaction) {
		try {
			const { value, name } = interaction.options.getFocused(true);
			if (!value?.trim()) return;

			const commandCollection = bot.commands;

			if (name === "category") {
				const categories = getCategoryList(commandCollection);
				const filteredCategories = categories
					.filter(category =>
						category.toLowerCase().startsWith(value.toLowerCase())
					)
					.slice(0, 25);

				await interaction.respond(
					filteredCategories.map(category => ({
						name: category,
						value: category
					}))
				);
			} else if (name === "command") {
				// Implement command autocomplete if needed
				const filteredCommands = Array.from(commandCollection.values())
					.filter(cmd => cmd.name.toLowerCase().startsWith(value.toLowerCase()))
					.slice(0, 25);

				await interaction.respond(
					filteredCommands.map(cmd => ({
						name: cmd.name,
						value: cmd.name
					}))
				);
			}
		} catch (error) {
			console.error("Error in help autocomplete:", error);
		}
	},

	async execute(interaction) {
		try {
			const commandCollection = bot.commands;
			const options = interaction.options._hoistedOptions;

			if (options.length > 1) {
				return await interaction.reply({
					content: "Please provide only one argument (either category or command).",
					flags: MessageFlags.Ephemeral
				});
			}

			// Show main help menu if no arguments
			if (!options.length) {
				const categories = getCategoryList(commandCollection);
				const helpEmbed = createHelpEmbed(commandCollection.size);
				helpEmbed.addFields({
					name: "Available categories",
					value: "`help <category>`\n\n`" + categories.join("`, `") + "`",
					inline: true
				});
				return await interaction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
			}

			const { value } = options[0];
			const categories = getCategoryList(commandCollection);

			if (categories.map(cat => cat.toLowerCase()).includes(value.toLowerCase())) {
				return handleCategoryHelp(interaction, commandCollection, value);
			}

			return handleCommandHelp(interaction, commandCollection, value.toLowerCase());
		} catch (error) {
			console.error("Error in help command:", error);
			return await interaction.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
};