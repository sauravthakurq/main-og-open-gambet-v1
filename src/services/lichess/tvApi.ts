import { fetchLichess } from './lichessClient';

export interface LichessUser {
  name: string;
  title?: string;
  rating: number;
  id: string;
}

export interface LichessTvGame {
  id: string;
  color: 'white' | 'black'; // The color to watch (the one whose turn it is or the streamer)
  player: LichessUser;
  rating: number;
  url: string; // The url to the game
}

export interface LichessTvChannel {
  name: string; // 'Bot', 'Blitz', 'Bullet', 'Classical', 'TopRated'
  gameId: string;
  user: LichessUser;
  rating: number;
}

export interface LichessTvChannelsResponse {
  [channelName: string]: LichessTvChannel;
}

export async function getTvChannels(): Promise<LichessTvChannelsResponse> {
  return fetchLichess<LichessTvChannelsResponse>('/tv/channels');
}

export async function getTopGames(): Promise<LichessTvGame[]> {
  // Alternatively, we can use the channels API to get top games across variants
  const channels = await getTvChannels();
  
  const games: LichessTvGame[] = [];
  
  // Convert object to array and extract game IDs
  for (const [name, channel] of Object.entries(channels)) {
    if (channel && channel.gameId) {
      games.push({
        id: channel.gameId,
        color: 'white', // Lichess channels don't strictly provide who to watch, just the top player
        player: channel.user,
        rating: channel.rating,
        url: `https://lichess.org/${channel.gameId}`,
      });
    }
  }

  // Deduplicate by game ID
  const uniqueGames = Array.from(new Map(games.map(item => [item.id, item])).values());
  return uniqueGames;
}

export interface BroadcastTour {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
}

export interface Broadcast {
  tour: BroadcastTour;
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  try {
    const response = await fetch('https://lichess.org/api/broadcast');
    if (!response.ok) return [];
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error('Failed to fetch broadcasts:', error);
    return [];
  }
}
