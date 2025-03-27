require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const { GatewayIntentBits } = require("discord.js");

module.exports.DiscordConfigurations = {
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.GuildModeration
	],
	botOwnerId: process.env.DISCORD_BOT_OWNER_ID,
	flagChannel: process.env.DISCORD_BOT_FLAGGED_CHANNEL,
	controlRole: process.env.DISCORD_BOT_CONTROL_ROLE,
	buttonInteractionExpiry: 3 * 60 * 1000,
	max_int: 2147483648
}