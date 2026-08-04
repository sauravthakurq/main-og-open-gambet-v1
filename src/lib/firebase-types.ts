// Firebase TypeScript type definitions for all Firestore collections

import { Timestamp } from 'firebase/firestore';

// ─── User / Profile ──────────────────────────────────────────
export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string | null;
  country: string | null;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  createdAt: Timestamp;
  lastSeen: Timestamp;
  online: boolean;
  playing: boolean;
  isGuest: boolean;
}

// ─── Game Room ─────────────────────────────────────────────
export type GameStatus = 'waiting' | 'active' | 'completed' | 'aborted';
export type GameResult = 'white' | 'black' | 'draw' | null;
export type GameEndReason = 'checkmate' | 'stalemate' | 'draw' | 'resignation' | 'timeout' | 'repetition' | 'insufficient' | 'agreement' | null;

export interface OnlineGame {
  id: string;
  whiteUid: string;
  blackUid: string;
  whiteProfile: Pick<UserProfile, 'uid' | 'username' | 'displayName' | 'photoURL' | 'rating'>;
  blackProfile: Pick<UserProfile, 'uid' | 'username' | 'displayName' | 'photoURL' | 'rating'>;
  status: GameStatus;
  fen: string;
  pgn: string;
  turn: 'w' | 'b';
  moveCount: number;
  timeControl: { minutes: number; increment: number } | null;
  whiteTimeMs: number;
  blackTimeMs: number;
  lastMoveAt: Timestamp | null;
  createdAt: Timestamp;
  result: GameResult;
  endReason: GameEndReason;
  drawOfferBy: string | null; // uid of who offered draw
  isPrivate: boolean;
  roomCode: string | null;
  spectatorCount: number;
}

// ─── Move ──────────────────────────────────────────────────
export interface OnlineMove {
  id?: string;
  moveIndex: number;
  san: string;          // e.g. "e4"
  uci: string;          // e.g. "e2e4"
  from: string;
  to: string;
  promotion?: string;
  fen: string;          // position after this move
  playedAt: Timestamp;
  playerUid: string;
}

// ─── Room (Private Match) ──────────────────────────────────
export type RoomStatus = 'open' | 'full' | 'started' | 'cancelled';

export interface PrivateRoom {
  id: string;
  code: string;         // 6-char alphanumeric room code
  hostUid: string;
  hostProfile: Pick<UserProfile, 'uid' | 'username' | 'displayName' | 'photoURL' | 'rating'>;
  guestUid: string | null;
  guestProfile: Pick<UserProfile, 'uid' | 'username' | 'displayName' | 'photoURL' | 'rating'> | null;
  status: RoomStatus;
  timeControl: { minutes: number; increment: number } | null;
  isRated?: boolean;
  spectatorsAllowed?: boolean;
  isPublic?: boolean;
  hostColorPreference?: 'white' | 'black' | 'random';
  isLocked?: boolean;
  hostReady?: boolean;
  guestReady?: boolean;
  createdAt: Timestamp;
  gameId: string | null; // filled once game starts
}

// ─── Matchmaking ──────────────────────────────────────────
export interface MatchmakingEntry {
  uid: string;
  username: string;
  rating: number;
  timeControl: { minutes: number; increment: number } | null;
  createdAt: Timestamp;
  status: 'searching' | 'matched';
}

// ─── Notification ─────────────────────────────────────────
export type NotificationType = 
  | 'match_found'
  | 'friend_online'
  | 'challenge_received'
  | 'challenge_accepted'
  | 'challenge_declined'
  | 'room_join_request'
  | 'room_join_accepted'
  | 'room_join_declined'
  | 'game_started'
  | 'draw_offer'
  | 'opponent_resigned'
  | 'opponent_left';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  fromUid: string | null;
  fromUsername: string | null;
  gameId: string | null;
  roomId: string | null;
  read: boolean;
  createdAt: Timestamp;
}

// ─── Chat Message ─────────────────────────────────────────
export interface ChatMessage {
  id?: string;
  senderUid: string;
  senderUsername: string;
  senderPhotoURL: string | null;
  text: string;
  isQuick: boolean;
  createdAt: Timestamp;
}

// ─── Presence (RTDB) ──────────────────────────────────────
export interface PresenceData {
  online: boolean;
  lastSeen: number; // unix timestamp ms
  status: 'online' | 'searching' | 'playing' | 'offline';
}

// ─── Leaderboard Entry ────────────────────────────────────
export interface LeaderboardEntry {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string | null;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  country: string | null;
}
