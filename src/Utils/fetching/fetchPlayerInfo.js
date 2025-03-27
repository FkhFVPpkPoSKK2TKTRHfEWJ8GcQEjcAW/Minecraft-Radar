module.exports.fetchPlayerUuidByUsername = async (username) => {
	try {
		// https://api.mojang.com/users/profiles/minecraft/${username}
		const result = await (await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)).json();
		const resultId = await result.id;
		if(!resultId) throw new Error(`This user could not be found ${username}`);
		return resultId;
	} catch (error) {
		console.error("Error trying to fetch player uuid by username", error);
		throw error;
	}
}

module.exports.fetchPlayerUsernameByUuid = async (playerUuid) => {
	// https://api.minecraftservices.com/minecraft/profile/lookup/b4f491282e5e4b5aba5eb2509e4e44e6
	try {
		const result = await (await fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/${playerUuid}`)).json();
		const resultName = await result.name;
		if(!resultName) throw new Error(`This user could not be found ${playerUuid}`);
		return resultName;
	} catch(error) {
		console.error("Error trying to fetch player username by uuid", error);
		throw error;
	}
}