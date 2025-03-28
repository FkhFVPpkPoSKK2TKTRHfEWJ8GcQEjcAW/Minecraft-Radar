const { MineflayerConfiguration } = require("../../configurations/mineflayerClient.js");
const { readdirSync } = require("fs");
const mineflayer = require("mineflayer");

function createBotMineflayer() {
	// Create the bot 
	const mineflayerBot = mineflayer.createBot(MineflayerConfiguration);

	// Load event handlers
	const eventDirs = readdirSync("./src/Mineflayer/events/");
	for (const dirs of eventDirs) {
		const perEventFile = readdirSync(`./src/Mineflayer/events/${dirs}`).filter(file => file.endsWith(".js"));
		for (const file of perEventFile) {
			const event = require(`./events/${dirs}/${file}`);
			console.log(`${new Date()} [Events Loaded]: ${file} from ${dirs}!`);
			mineflayerBot.on(file.replace(".js", ""), event.bind(null, mineflayerBot));
			delete require.cache[require.resolve(`./events/${dirs}/${file}`)];
		}
	}

	return mineflayerBot;
}

// Export the function
module.exports.createBotMineflayer = createBotMineflayer;