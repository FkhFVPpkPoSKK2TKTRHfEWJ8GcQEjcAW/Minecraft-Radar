module.exports = (error) => {
	console.log(`Bot has encountered an error: ${new Date().toString()}\nError: ${JSON.stringify(error)}`);
}