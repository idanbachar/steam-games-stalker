import dotenv from "dotenv";
import { getCurrentPlayingGame } from "../services/SteamWorks";
dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const steamId = process.env.STEAM_ID;
const friendsIds = process.env.FRIENDS_IDS;

const init = () => {
  setInterval(() => {
    (async () => {
      const currentPlayingGame = await getCurrentPlayingGame(apiKey!, friendsIds!);
      

    })();
  }, 1000);
};

init();
