require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

module.exports.MineflayerConfiguration = {
	host: process.env.MINECRAFT_SERVER_IP_ADDRESS,
	username: process.env.MINECRAFT_BOT_USERNAME,
	auth: process.env.MINECRAFT_AUTH_METHOD,
}