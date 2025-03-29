const { allowListModel } = require("../../Models/allowedPlayersModel.js");
const { sendBotChannel } = require("../Discord/sendChannelMessage.js");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const playerLocationTracker = {
	intervalId: null,
	playersInRadiusDiscordAlert: new Set(),
	latestBotLocation: null,
	playerLastLocations: new Map(),

	async startLogging(bot, interval = 10000) {
		if (this.intervalId !== null) {
			console.log("Logging is already started.");
			return;
		}

		this.intervalId = setInterval(async () => {
			try {
				const allPlayersLocation = await this.getAllPlayersLocations(bot);
				if(allPlayersLocation.length > 0) {
					console.log(allPlayersLocation);
				}
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

		// If player not found or entity not in render distance
		if (!player || !player.entity) {
			const playerUuid = player?.uuid;
			if (playerUuid && this.playersInRadiusDiscordAlert.has(playerUuid) && !await allowListModel.includeCheck(playerUuid)) {
				this.playersInRadiusDiscordAlert.delete(playerUuid);
				const lastLocation = this.playerLastLocations.get(playerUuid);
				
				const embed = new EmbedBuilder()
					.setTitle("Player Left Render Distance")
					.setColor("Yellow")
					.setDescription(
						`Player Username: ${playerName}\n` +
						`Player UUID: ${playerUuid}\n` +
						(lastLocation ? `Last Known Location: X: ${Math.round(lastLocation.x)}, Y: ${Math.round(lastLocation.y)}, Z: ${Math.round(lastLocation.z)}` : "No last known location")
					)
					.setTimestamp();

				await sendBotChannel({ embeds: [embed] });
				this.playerLastLocations.delete(playerUuid);
			}
			return;
		}

		const location = player.entity.position;
		if(player.username === process.env.MINECRAFT_BOT_USERNAME) {
			this.latestBotLocation = {
				x: location.x,
				y: location.y,
				z: location.z,
			};
			return;
		}

		const playerUuid = player.uuid;
		this.playerLastLocations.set(playerUuid, {
			x: location.x,
			y: location.y,
			z: location.z,
		});

		if(!await allowListModel.includeCheck(playerUuid) && !this.playersInRadiusDiscordAlert.has(playerUuid)) {
			await this.playersInRadiusDiscordAlert.add(playerUuid);

			const embed = new EmbedBuilder()
				.setTitle("Player Detected In Render Distance")
				.setColor("Red")
				.setDescription(
					`Player Username: ${player.username}\n` +
					`Player UUID: ${playerUuid}\n` +
					`Location: X: ${Math.round(location.x)}, Y: ${Math.round(location.y)}, Z: ${Math.round(location.z)}`
				)
				.setTimestamp();

			await sendBotChannel({ embeds: [embed] });
		}

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