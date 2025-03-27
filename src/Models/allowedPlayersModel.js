const { db } = require("../Database/database.js");

// it is within common expectation for the discord bot/layer to handle the translation of usernames to uuid

module.exports.allowListModel = {
	async push(playerId) {
		await db.push("allowList", playerId);
	},
	async pull(playerId) {
		await db.pull("allowList", playerId);
	},
	async fetch() {
		return await db.get("allowList");
	},
	async includeCheck(playerId) {
		const playerData = await this.fetch() || [];
		return playerData.includes(playerId);
	},
	async deleteAll() {
		await db.delete("allowList");
	}
}