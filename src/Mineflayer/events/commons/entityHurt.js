const { botWalkingState } = require("../../../Utils/Mineflayer/additionalStates.js");

module.exports = async (entity) => {
	await delete require.cache[require.resolve("../../../../configurations/allowList.json")];
	const allowList = require("../../../../configurations/allowList.json");
	const { ...details } = entity;
	const { ...botDetails } = MineflayerBot.entity;
	if (details._client.username != botDetails.username) return;
	const player = MineflayerBot.nearestEntity(({ type }) => type === "player");
	if (!player || !allowList.opUsers.includes(player.username)) {
		MineflayerBot.setControlState("forward", false);
		return;
	}
	botWalkingState.changeState();
	walking = botWalkingState.getState();
	MineflayerBot.setControlState("forward", walking);
}