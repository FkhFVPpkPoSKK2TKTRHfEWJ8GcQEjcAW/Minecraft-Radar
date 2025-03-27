const { playerLocationTracker } = require("../../../Utils/Mineflayer/getDistanceFromPlayer.js");
const { botWalkingState } = require("../../../Utils/Mineflayer/additionalStates.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = async (MineflayerBot) => {
	console.log(`Bot has been spawned/logged in: ${new Date().toString()}\n`);

	// default behaviour on spawn
	botWalkingState.setFalse();
	MineflayerBot.chat(process.env.MINECRAFT_MESSAGE_UPON_SPAWN) // remove this line - this was added for a project on a server i play on
	MineflayerBot.setControlState("sneak", true);
	MineflayerBot.setControlState("forward", false);

	// Start player location tracking
	await playerLocationTracker.startLogging(MineflayerBot, process.env.MINECRAFT_BOT_COORDINATE_FREQUENCY_MS);
};