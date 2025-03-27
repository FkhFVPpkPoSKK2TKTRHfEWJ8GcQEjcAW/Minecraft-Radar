module.exports = (reason) => {
	console.log(`Server ended connection: ${new Date().toString()}\nReason: ${JSON.stringify(reason)}`);
}