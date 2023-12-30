import dotenv from "dotenv";
import { exec } from "child_process";
import { getCurrentPlayingGames } from "../services/SteamWorks";
dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const steamId = process.env.STEAM_ID;
const friendsIds = process.env.FRIENDS_IDS;
const steamAppId = "2073850";
const steamPath = "C:\\Program Files (x86)\\Steam\\Steam.exe";
const command = `"${steamPath}" -applaunch ${steamAppId}`;
const gameNameToLaunch = "The Finals";

const init = () => {
  const interval = setInterval(() => {
    (async () => {
      const currentPlayingGames = await getCurrentPlayingGames(
        apiKey!,
        friendsIds!
      );
      if (currentPlayingGames !== undefined) {
        if (currentPlayingGames.includes(gameNameToLaunch)) {
          exec(command, (error) => {
            if (error) {
              console.error(`Error launching Steam game: ${error}`);
              return;
            }
            console.log(`Steam game launched successfully`);
            return () => {
              clearInterval(interval);
            };
          });
        }
      }
    })();
  }, 1000);
};

init();
