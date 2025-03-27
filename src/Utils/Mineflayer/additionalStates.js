var walking = false;

botWalkingState = {
	changeState() {
		walking = !walking
		MineflayerBot.setControlState("sneak", !walking);
		MineflayerBot.setControlState("jump", walking);
		return walking;
	},
	getState() {
		return walking;
	},
	setFalse() {
		walking = false;
		return walking;
	},
	setTrue() {
		walking = true;
		return walking;
	}
}

module.exports = { botWalkingState };