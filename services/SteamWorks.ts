import axios from "axios";
import {
  ISteamFriend,
  ISteamGame,
  ISteamPlayerResult,
} from "../interfaces/ISteam";

const STEAM_API_PATH = "http://api.steampowered.com";
const PLAYER_SUMMARIES_PATH = `${STEAM_API_PATH}/ISteamUser/GetPlayerSummaries/v0002`;
const FRIENDLIST_PATH = `${STEAM_API_PATH}/ISteamUser/GetFriendList/v0001`;
const GAME_SCHEMA_PATH = `${STEAM_API_PATH}/ISteamUserStats/GetSchemaForGame/v2`;

const getFriendsList = async (apiKey: string, steamId: string) => {
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

const checkOnlineStatus = async (apiKey: string, steamId: string) => {
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

const getGameInfo = async (apiKey: string, gameid?: string) => {
  if (!gameid)
    return new Promise((resolve, reject) => {
      resolve(undefined);
    });
  return await axios.get(`${GAME_SCHEMA_PATH}/?key=${apiKey}&appid=${gameid}`);
};

export const IsPlayingStalkedGame = async (
  apiKey: string,
  steamids: string,
  gameToLaunch: string
) => {
  const currentPlayingGames = await getCurrentPlayingGames(apiKey, steamids);
  if (currentPlayingGames !== undefined) {
    if (currentPlayingGames.includes(gameToLaunch)) {
      return true;
    }
  }
  return false;
};

export const CheckPlayingAGame = async (
  apiKey: string,
  yourSteamId: string
) => {
  const response = await axios.get(
    `${PLAYER_SUMMARIES_PATH}/?key=${apiKey}&steamids=${yourSteamId}`
  );
  const players = response.data.response.players as ISteamPlayerResult[];
  return players[0].gameid !== undefined;
};

const getCurrentPlayingGames = async (apiKey: string, steamids: string) => {
  try {
    const response = await axios.get(
      `${PLAYER_SUMMARIES_PATH}/?key=${apiKey}&steamids=${steamids}`
    );
    const players = response.data.response.players as ISteamPlayerResult[];
    const promises = players.map((player) => {
      return getGameInfo(apiKey, player.gameid);
    });
    const results = await Promise.all(promises);
    const currentPlayingGames = results
      .filter((result) => result !== undefined)
      .map((game: any) => (game.data as ISteamGame).game.gameName);

    return currentPlayingGames;
  } catch (error) {
    console.error("Error fetching current playing game:", error);
  }
};
