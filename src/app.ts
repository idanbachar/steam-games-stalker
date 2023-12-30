import dotenv from "dotenv";
import { exec } from "child_process";
import {
  CheckPlayingAGame,
  IsPlayingStalkedGame,
} from "../services/SteamWorks";
import { Games } from "../services/GameObject";
dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const mySteamId = process.env.MY_STEAM_ID;
const friendsIds = process.env.FRIENDS_IDS;
const steamPath = process.env.STEAM_PATH;

const GAME_TO_LAUNCH = "The Finals";
const command = `"${steamPath}" -applaunch ${Games[GAME_TO_LAUNCH]}`;

let amIPlayingAGame = false;
let isPlayingStalkedGame = false;

const StalkFriends = async () => {
  do {
    isPlayingStalkedGame = await IsPlayingStalkedGame(
      apiKey!,
      friendsIds!,
      GAME_TO_LAUNCH
    );
    console.log("Checking for friends who playing", GAME_TO_LAUNCH);
  } while (!isPlayingStalkedGame && !amIPlayingAGame);
  if (!amIPlayingAGame) {
    amIPlayingAGame = true;
    exec(command, (error) => {
      if (error) {
        console.error(`Error launching Steam game: ${error}`);
        return;
      }
      console.log(`${GAME_TO_LAUNCH} game launched successfully`);
      amIPlayingAGame = true;
    });
  }
};

const init = async () => {
  do {
    amIPlayingAGame = await CheckPlayingAGame(apiKey!, mySteamId!);
    await StalkFriends();
  } while (!amIPlayingAGame);
};

(async () => {
  while (true) {
    await init();
  }
})();
