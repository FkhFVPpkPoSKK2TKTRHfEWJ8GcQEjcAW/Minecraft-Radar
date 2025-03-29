# Minecraft CCTV Bot

A Discord and Mineflayer bot that monitors nearby users to an area to ensure security of bases and facilities.

## Prerequisites

1. **Node.js Installation**

   - Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Recommended version: Node.js 18.x or higher
   - Verify installation by running `node --version` in your terminal

2. **Visual Studio Code (Recommended)**
   - Download and install VS Code from [code.visualstudio.com](https://code.visualstudio.com/)
   - Recommended extensions:
     - ESLint
     - Prettier
     - Node.js Extension Pack

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/CCTV.git
   cd CCTV
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Discord Bot Token Setup**

   1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
   2. Click "New Application" and give it a name
   3. Go to the "Bot" section and click "Add Bot"
   4. Under the bot's username, click "Reset Token" and copy the token
   5. Enable the following bot intents:
      - Presence Intent
      - Server Members Intent
      - Message Content Intent

4. **Environment Configuration**

   1. Copy the example environment file:
      ```bash
      cp example.env .env.production
      ```
   2. Edit the `.env.production` file with your configuration:

      ```
		# Minecraft Configurations
		MINECRAFT_SERVER_IP_ADDRESS =
		MINECRAFT_BOT_USERNAME =
		MINECRAFT_AUTH_METHOD =
		MINECRAFT_SERVER_VERSION =
		MINECRAFT_MESSAGE_UPON_SPAWN =
		
		# 1000ms is about 20 minecraft ticks
		MINECRAFT_BOT_COORDINATE_FREQUENCY_MS =
		
		# Discord Bot Configurations
		DISCORD_BOT_OWNER_ID =
		DISCORD_BOT_FLAGGED_CHANNEL =
		DISCORD_BOT_CONTROL_ROLE =
		DISCORD_TOKEN =
		
		# Death Event
		DISCORD_MINEFLAYER_BOT_DEATH_MESSAGE =
		MINECRAFT_CHAT_UPON_DEATH =
		
		
		SERVER_CHUNK_RADIUS = 12 # I have no way of actually getting this information
      ```

5. **Configure Allowed Users**
   1. Navigate to `configurations/allowList.json`
   2. Edit the file to include operator usernames:
      ```json
      {
        "opUsers": [
          "username1",
          "username2"
        ]
      }
      ```
   3. These users will have special privileges with the bot, such as:
      - Bot will track and follow these users
	  - If you are on this list, hit the bot to make it follow you and hit it again to make it stop following you.
      - Enhanced monitoring capabilities

6. **Deployment**
   1. Start the bot in development mode:
      ```bash
      npm run deployProd
      ```
   2. For production deployment:
      ```bash
      npm start
      ```

## Usage

1. Invite the bot to your Discord server using the OAuth2 URL from the Discord Developer Portal
2. Make sure the bot has the necessary permissions:

   - Read Messages/View Channels
   - Send Messages
   - Read Message History
   - View Server Insights

3. The bot will now monitor your Minecraft server and send updates to the configured Discord channel

## Troubleshooting

- If the bot fails to start, check:
  - All environment variables are properly set
  - Discord bot token is valid
  - Bot has proper permissions in the Discord server
  - Node.js version is compatible

## Support

For issues or questions, please open an issue in the GitHub repository.
