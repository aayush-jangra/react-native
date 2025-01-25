import {MMKV} from 'react-native-mmkv';
import {PlayerData} from '../schema/storage';
import {Track} from 'react-native-track-player';

export enum StorageKeys {
  PLAYER_DATA = 'playerData',
  RECENT_SONGS = 'recentSongs',
}

export class StorageService {
  private static instance: StorageService;
  private storage: MMKV;

  private constructor() {
    this.storage = new MMKV();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public loadPlayerData() {
    const playerDataJson = this.storage.getString(StorageKeys.PLAYER_DATA);
    const playerData = playerDataJson
      ? (JSON.parse(playerDataJson) as PlayerData)
      : null;

    return playerData;
  }

  public setPlayerData({
    playingTrackIndex,
    startQueue,
    playingQueue,
    repeatMode,
    isShuffled,
  }: PlayerData) {
    let overrideData: Partial<PlayerData> = {};
    if (playingTrackIndex !== undefined) {
      overrideData = {...overrideData, playingTrackIndex};
    }
    if (startQueue && startQueue.length) {
      overrideData = {...overrideData, startQueue};
    }
    if (playingQueue && playingQueue.length) {
      overrideData = {...overrideData, playingQueue};
    }
    if (isShuffled !== undefined) {
      overrideData = {...overrideData, isShuffled};
    }
    if (repeatMode !== undefined) {
      overrideData = {...overrideData, repeatMode};
    }

    const existingData = this.loadPlayerData();
    const newData: PlayerData = {...existingData, ...overrideData};

    this.storage.set(StorageKeys.PLAYER_DATA, JSON.stringify(newData));
  }

  public loadRecentSongs() {
    const recentSongsJson = this.storage.getString(StorageKeys.RECENT_SONGS);
    const recentSongs = recentSongsJson
      ? (JSON.parse(recentSongsJson) as Track[])
      : null;

    return recentSongs;
  }

  public setRecentSongs(songs: Track[]) {
    this.storage.set(StorageKeys.RECENT_SONGS, JSON.stringify(songs));
  }
}
