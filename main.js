const { createBotMineflayer } = require("./src/Mineflayer/bot.js");
require("./src/Database/database.js");
require("./src/Discord/bot.js");
global.MineflayerBot = createBotMineflayer();