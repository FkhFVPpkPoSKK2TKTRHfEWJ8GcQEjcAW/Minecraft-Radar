module.exports = (reason, loggedIn) => {
	console.log(`Bot has been kicked: ${new Date().toString()}\nReason: ${JSON.stringify(reason)}\nWas Bot Kicked While Logged In?: ${loggedIn}`);
}