# Discord Bot with Asana API Integration

A Discord bot that seamlessly integrates with Asana API, enabling you to manage your tasks directly from Discord. This bot allows you to create, delete, complete, and retrieve tasks from your Asana workspace, providing a streamlined experience for you and your team.

## Features

- **Task Management**: Create, delete, complete, and retrieve tasks from your Asana workspace without leaving Discord.
- **Task Assignments**: Assign tasks to team members using their Discord usernames.
- **Task Deadlines**: Set deadlines for tasks to keep track of project timelines.

## Getting Started

Follow the steps below to set up the Discord bot with Asana API integration:

1. Clone this repository to your local machine.

git clone https://github.com/MaikiBR/AsanaDiscordBot.git

2. Install the required dependencies using the package manager of your choice.

cd asanabot

npm install

3. Create a new Discord bot and obtain your bot token. You can create a bot and get the token from the Discord Developer Portal.

4. Create an Asana API token by following the Asana API documentation.

5. Create the `.env` file and update the following configuration values:

DISCORD_BOT_TOKEN=your_discord_bot_token

ASANA_ACCESS_TOKEN=your_asana_api_token

ID_PROYECTO_ASANA=your_asana_project_id

CLIENT_ID=your_client_id

GUILD_ID=your_guild_id

6. Start the bot using the following command:

node run start:dev

7. Invite the bot to your Discord server using the OAuth2 URL generated from the Discord Developer Portal.

8. You're all set! Start managing your Asana tasks using the bot slash commands.

## Bot Commands

Use the following commands to interact with the Discord bot:

- /tareas <seccion>: Retrieve task of a specific section.
- /crear-tareas <nombre-tarea> <seccion> <fecha-entrega> <responsable>: Create a new task in your Asana workspace.
- /completar-tarea <tarea-gid>: Complete a task of your Asana workspace.
- /eliminar-tarea <tarea-gid>: Delete a task of your Asana workspace.

## License

This project is licensed under the MIT License.
