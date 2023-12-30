# Steam Games Stalker

The **Steam Stalk Launcher** is a Node.js and TypeScript project designed to enhance your gaming experience on Steam. Leveraging the Steam API and environment variables, this tool allows you to monitor the gaming activities of your selected friends and automatically launch your preferred game when they are playing like a REAL stalker.

## Features

- **Steam API Integration:** Utilizes the Steam API to fetch real-time data on your friends' gaming activities.
- **Automated Launch:** Automatically launches your selected game when one of your friends is detected playing it.
- **Configuration via Environment Variables:** Easily configure your Steam API key, Steam ID, friends' IDs, and Steam path using environment variables for enhanced security.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/idanbachar/steam-games-stalker.git
   ```

2. Install dependencies:

   ```bash
   cd steam-games-stalker
   npm install

   ```

3. Configure environment variables in the `.env` file.

4. Build the project:

   ```bash
   npm run build
   ```

5. Run the application:

   ```bash
   npm start
   ```

Enjoy a seamless gaming experience with the **Steam Stalk Launcher**!

## Configuration

Adjust the following environment variables in the `.env` file:

- `STEAM_API_KEY`: Your Steam API key.
- `MY_STEAM_ID`: Your Steam ID.
- `FRIENDS_IDS`: IDs of your Steam friends.
- `STEAM_PATH`: Path to your Steam installation.

## Launching a Specific Game

- `const GAME_TO_LAUNCH` = "The Finals";
- `const command` = `"${steamPath}" -applaunch ${Games[GAME_TO_LAUNCH]}`;

To launch a specific game using the Steam Stalk Launcher, you can customize the `GAME_TO_LAUNCH` variable in the code. The launcher utilizes a `Games` object, which is a dictionary mapping game names to their corresponding game IDs.

For example, consider the following `Games` object:

```typescript
export const Games = {
  "Counter Strike 2": 730,
  "The Finals": 2073850,
};
```

## Enjoy!
