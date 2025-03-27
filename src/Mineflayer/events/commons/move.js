module.exports = async () => {
	await delete require.cache[require.resolve("../../../../configurations/allowList.json")];
	const allowList = require("../../../../configurations/allowList.json");

	const player = MineflayerBot.nearestEntity(({ type }) => type === "player");
	if (!player) {
		MineflayerBot.setControlState("forward", false);
		return;
	}
	if (allowList.opUsers.includes(player.username)) {
		MineflayerBot.lookAt(player.position.offset(0, player.height, 0));
	}
}