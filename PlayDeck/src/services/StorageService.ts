import {MMKV} from 'react-native-mmkv';
import {PlayerData, PlaylistData, SavedQueueData} from '../schema/storage';
import {Track} from 'react-native-track-player';
import {SortOptions} from '../pages/Library/sortOptions';

export enum StorageKeys {
  PLAYER_DATA = 'playerData',
  RECENT_SONGS_DATA = 'recentSongsData',
  PLAYLISTS_DATA = 'playlistsData',
  SORT_PREFERENCE = 'sortPreference',
  SAVED_QUEUES_DATA = 'savedQueuesData',
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
    playingFrom,
    name,
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
    if (playingFrom !== undefined) {
      overrideData = {...overrideData, playingFrom};
    }
    if (name !== undefined) {
      overrideData = {...overrideData, name};
    }

    const existingData = this.loadPlayerData();
    const newData: PlayerData = {...existingData, ...overrideData};

    this.storage.set(StorageKeys.PLAYER_DATA, JSON.stringify(newData));
  }

  public loadRecentSongs() {
    const recentSongsJson = this.storage.getString(
      StorageKeys.RECENT_SONGS_DATA,
    );
    const recentSongs = recentSongsJson
      ? (JSON.parse(recentSongsJson) as Track[])
      : null;

    return recentSongs;
  }

  public setRecentSongs(songs: Track[]) {
    this.storage.set(StorageKeys.RECENT_SONGS_DATA, JSON.stringify(songs));
  }

  public loadPlaylists() {
    const playlistsJson = this.storage.getString(StorageKeys.PLAYLISTS_DATA);
    const playlists = playlistsJson
      ? (JSON.parse(playlistsJson) as PlaylistData[])
      : null;

    return playlists;
  }

  public addPlaylist(playlist: PlaylistData) {
    const existingPlaylists = this.loadPlaylists();
    const newData = existingPlaylists
      ? [...existingPlaylists, playlist]
      : [playlist];

    this.storage.set(StorageKeys.PLAYLISTS_DATA, JSON.stringify(newData));
  }

  public deletePlaylist(playlistName: string) {
    const existingPlaylists = this.loadPlaylists();
    const newData = existingPlaylists?.filter(
      playlist => playlist.name !== playlistName,
    );

    this.storage.set(StorageKeys.PLAYLISTS_DATA, JSON.stringify(newData));
  }

  public addTrackToPlaylist(playlistName: string, track: Track) {
    const existingPlaylists = this.loadPlaylists();
    if (existingPlaylists) {
      const newData = [...existingPlaylists];

      const playlistToChange = newData.find(
        playlist => playlist.name === playlistName,
      );

      if (playlistToChange) {
        playlistToChange.tracks.push(track);
        playlistToChange.numberOfTracks += 1;
        playlistToChange.durationOfPlaylist += track.duration || 0;
      }

      this.storage.set(StorageKeys.PLAYLISTS_DATA, JSON.stringify(newData));
    }
  }

  public addTracksToPlaylist(
    playlistName: string,
    tracks: Track[],
    totalDuration: number,
  ) {
    const existingPlaylists = this.loadPlaylists();
    if (existingPlaylists) {
      const newData = [...existingPlaylists];

      const playlistToChange = newData.find(
        playlist => playlist.name === playlistName,
      );

      if (playlistToChange) {
        playlistToChange.tracks.push(...tracks);
        playlistToChange.numberOfTracks += tracks.length;
        playlistToChange.durationOfPlaylist += totalDuration;
      }

      this.storage.set(StorageKeys.PLAYLISTS_DATA, JSON.stringify(newData));
    }
  }

  public removeTrackFromPlaylist(playlistName: string, track: Track) {
    const existingPlaylists = this.loadPlaylists();
    if (existingPlaylists) {
      const newData = [...existingPlaylists];

      const playlistToChange = newData.find(
        playlist => playlist.name === playlistName,
      );

      if (playlistToChange) {
        playlistToChange.tracks = playlistToChange.tracks.filter(
          item => item.url !== track.url,
        );
        playlistToChange.numberOfTracks--;
        playlistToChange.durationOfPlaylist -= track.duration || 0;
      }

      this.storage.set(StorageKeys.PLAYLISTS_DATA, JSON.stringify(newData));
    }
  }

  public loadSortPreference() {
    const sortPreference = this.storage.getString(
      StorageKeys.SORT_PREFERENCE,
    ) as SortOptions | undefined;

    return sortPreference;
  }

  public setSortPreference(pref: SortOptions) {
    this.storage.set(StorageKeys.SORT_PREFERENCE, pref);
  }

  public loadSavedQueues() {
    const queuesJson = this.storage.getString(StorageKeys.SAVED_QUEUES_DATA);
    const queues = queuesJson
      ? (JSON.parse(queuesJson) as SavedQueueData[])
      : null;

    return queues;
  }

  public saveQueue(queue: SavedQueueData) {
    const existingQueues = this.loadSavedQueues() || [];
    existingQueues.unshift(queue);

    this.storage.set(
      StorageKeys.SAVED_QUEUES_DATA,
      JSON.stringify(existingQueues),
    );
  }

  public deleteQueue(queueName: string) {
    const existingQueues = this.loadSavedQueues() || [];

    this.storage.set(
      StorageKeys.SAVED_QUEUES_DATA,
      JSON.stringify(existingQueues.filter(item => item.name !== queueName)),
    );
  }
}
