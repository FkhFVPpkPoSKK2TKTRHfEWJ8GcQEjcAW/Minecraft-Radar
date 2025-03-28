const { cpuUsage } = require("os-utils");

module.exports = async (bot) => {
	cpuUsage(function(cpuUsageDetails) {
		const rawMemoryUsage = process.memoryUsage.rss() / 1024 / 1024;
		const estimatedMemoryUsage = Math.round(rawMemoryUsage * 100) / 100;
		console.log(`${new Date()} [Status and uptime]: Logged in as ${bot.user.tag}\n\nReady on ${bot.guilds.cache.size} servers and helping about ${bot.users.cache.size} users!\n\nHardware report: \nMemory: ${estimatedMemoryUsage}MBib\nCpu Usage: ${Math.round(cpuUsageDetails * 100) / 100}% cpu`);
	});

	bot.user.setActivity("For the minewind community, by the minewind community.");
	bot.guilds.cache.map(guild => {
		console.log(`\n\n[guildname] ${guild.name}\n[guildid] ${guild.id}\n\n`);
	});
}