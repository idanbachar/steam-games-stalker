import axios from "axios";
import { ISteamFriend, ISteamPlayerResult } from "../interfaces/ISteam";

const STEAM_API_PATH = "http://api.steampowered.com";
const PLAYER_SUMMARIES_PATH = `${STEAM_API_PATH}/ISteamUser/GetPlayerSummaries/v0002`;
const FRIENDLIST_PATH = `${STEAM_API_PATH}/ISteamUser/GetFriendList/v0001`;
const GAME_SCHEMA_PATH = `${STEAM_API_PATH}/ISteamUserStats/GetSchemaForGame/v2`;

export const getFriendsList = async (apiKey: string, steamId: string) => {
  try {
    const response = await axios.get(
      `${FRIENDLIST_PATH}/?key=${apiKey}&steamid=${steamId}&relationship=friend`
    );
    return response.data.friendslist.friends as ISteamFriend[];
  } catch (error) {
    console.error("Error fetching friends list:", error);
    throw error;
  }
};

export const checkOnlineStatus = async (apiKey: string, steamId: string) => {
  try {
    const friendsList = await getFriendsList(apiKey, steamId);
    for (const friend of friendsList) {
      const friendInfo = await axios.get(
        `${PLAYER_SUMMARIES_PATH}/?key=${apiKey}&steamids=${friend.steamid}`
      );
      const { personaname, personastate } = friendInfo.data.response.players[0];
      console.log(
        `${personaname} is ${personastate === 1 ? "online" : "offline"}`
      );
      return personastate === 1 ? "online" : "offline";
    }
  } catch (error) {
    console.error("Error checking online status:", error);
  }
};

export const getCurrentPlayingGame = async (
  apiKey: string,
  steamids: string
) => {
  try {
    const response = await axios.get(
      `${PLAYER_SUMMARIES_PATH}/?key=${apiKey}&steamids=${steamids}`
    );
    const players = response.data.response.players as ISteamPlayerResult[];
    for (let i = 0; i < players.length; i++) {
      if (players[i].gameid) {
        const gameInfo = await axios.get(
          `${GAME_SCHEMA_PATH}/?key=${apiKey}&appid=${players[i].gameid}`
        );
        const gameName = gameInfo.data.game.gameName;
        console.log(
          `${players[i].personaname} is currently playing ${gameName}`
        );
        return gameName;
      } else {
        console.log(`${players[i].personaname} is not currently in-game`);
      }
    }
  } catch (error) {
    console.error("Error fetching current playing game:", error);
  }
};
