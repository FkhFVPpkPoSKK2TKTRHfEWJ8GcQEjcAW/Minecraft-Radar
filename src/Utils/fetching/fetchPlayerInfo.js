module.exports.fetchPlayerUuidByUsername = async (username) => {
	try {
		// Fetch player data from Mojang's API
		const result = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then(response => response.json());
		const resultId = result.id; // Directly access the UUID from the response

		// If no UUID is found, throw an error
		if (!resultId) throw new Error(`This user could not be found: ${username}`);

		// Format the UUID by inserting hyphens - THIS WILL BE CHANGED
		const formattedUuid = resultId.slice(0, 8) + "-" + resultId.slice(8, 12) + "-" + resultId.slice(12, 16) + "-" + resultId.slice(16, 20) + "-" + resultId.slice(20);

		return formattedUuid; // Return the formatted UUID
	} catch (error) {
		console.error("Error trying to fetch player uuid by username", error);
		throw error;
	}
};

module.exports.fetchPlayerUsernameByUuid = async (playerUuid) => {
	// https://api.minecraftservices.com/minecraft/profile/lookup/b4f491282e5e4b5aba5eb2509e4e44e6
	try {
		const result = await (await fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/${playerUuid.replaceAll("-", "")}`)).json();
		const resultName = await result.name;
		if (!resultName) throw new Error(`This user could not be found ${playerUuid}`);
		return resultName;
	} catch (error) {
		console.error("Error trying to fetch player username by uuid", error);
		throw error;
	}
}