import {MMKV} from 'react-native-mmkv';
import {PlayerData} from '../schema/storage';

export enum StorageKeys {
  PLAYER_DATA = 'playerData',
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

  public loadMiniPlayerData() {
    const playerDataJson = this.storage.getString(StorageKeys.PLAYER_DATA);
    const playerData = playerDataJson
      ? (JSON.parse(playerDataJson) as PlayerData)
      : null;

    return playerData;
  }

  public setMiniPlayerData({
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

    const existingData = this.loadMiniPlayerData();
    const newData: PlayerData = {...existingData, ...overrideData};

    this.storage.set(StorageKeys.PLAYER_DATA, JSON.stringify(newData));
  }
}
