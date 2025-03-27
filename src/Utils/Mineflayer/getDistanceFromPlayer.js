const { allowListModel } = require("../../Models/allowedPlayersModel.js");
const { sendBotChannel } = require("../Discord/sendChannelMessage.js");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const playerLocationTracker = {
	intervalId: null,
	playersInRadiusDiscordAlert: new Set(),

	async startLogging(bot, interval = 10000) {
		if (this.intervalId !== null) {
			console.log("Logging is already started.");
			return;
		}

		this.intervalId = setInterval(async () => {
			try {
				const allPlayersLocation = await this.getAllPlayersLocations(bot);
				if(allPlayersLocation.length > 0) return;
				console.log(allPlayersLocation);
			} catch (error) {
				console.error("Error logging player locations:", error);
			}
		}, interval);

		console.log(`Started logging player locations every ${interval / 1000} seconds.`);
	},

	async stopLogging() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			console.log("Stopped logging player locations.");
		} else {
			console.log("Logging is not currently running.");
		}
	},

	async getPlayerLocation(bot, playerName) {
		const player = bot.players[playerName];

		if (!player || !player.entity || player.username === process.env.MINECRAFT_BOT_USERNAME) {
			return;
			// return { error: 'Player not found' };
		}

		const location = player.entity.position;
		const playerUuid = player.uuid;
		if(allowListModel.includeCheck(playerUuid) && !this.playersInRadiusDiscordAlert.has(playerUuid)) {
			await this.playersInRadiusDiscordAlert.add(playerUuid);

			const embed = new EmbedBuilder();
			embed
				.setTitle("Player Detected In Render Distance")
				.setColor("Red")
				.setDescription(`Player Username: ${player.username}\nPlayer UUID: ${playerUuid}`)
				.setTimestamp();

			await sendBotChannel({ embeds: [embed] })
		}

		// Return the player and their location in JSON format
		return {
			player: playerName,
			location: {
				x: location.x,
				y: location.y,
				z: location.z,
			},
		};
	},

	async getAllPlayersLocations(bot) {
		const playersLocation = [];

		// Loop through the bot.players map
		for (let playerName in bot.players) {
			try {
				const playerLocation = await this.getPlayerLocation(bot, playerName);
				if (playerLocation) {
					playersLocation.push(playerLocation);
				}
			} catch (error) {
				console.error(`Error getting location for player ${playerName}:`, error);
			}
		}

		// Return all players' locations
		return playersLocation;
	}
};

module.exports = {
	playerLocationTracker
};