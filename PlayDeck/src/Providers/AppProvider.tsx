import React, {createContext, useContext, useEffect, useState} from 'react';
import {AppState} from '../schema/appState';
import TrackPlayer, {RepeatMode, Track} from 'react-native-track-player';
import {setupPlayer} from '../services/PlaybackService';
import {requestStoragePermission} from '../utils/requestPermissions';
import {StorageService} from '../services/StorageService';
import {AppWideEventListener} from '../components/AppWideEventListener';
import {PlaylistData} from '../schema/storage';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  // Player data
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [startQueue, setStartQueue] = useState<Track[] | null>(null);
  const [queue, setQueue] = useState<Track[] | null>(null);
  const [queueName, setQueueName] = useState<string | undefined>();
  const [playingQueueFrom, setPlayingQueueFrom] = useState<string[]>([]);

  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [recentSongs, setRecentSongs] = useState<Track[]>([]);

  const setupTrackPlayer = async () => {
    const isSetup = await setupPlayer();

    if (isSetup) {
      const storageRecentSongs = StorageService.getInstance().loadRecentSongs();
      const storagePlayerData = StorageService.getInstance().loadPlayerData();

      if (storageRecentSongs) {
        setRecentSongs(storageRecentSongs);
      }

      if (storagePlayerData) {
        const {
          playingQueue,
          playingTrackIndex,
          startQueue: startQueueStorage,
          isShuffled: isShuffledStorage,
          repeatMode: repeatModeStorage,
          playingFrom,
          name,
        } = storagePlayerData;
        setQueueName(name);
        setQueue(playingQueue ?? null);
        setPlayingQueueFrom(playingFrom || []);
        setStartQueue(startQueueStorage ?? null);
        if (playingQueue) {
          await TrackPlayer.reset();
          await TrackPlayer.add(playingQueue);
        }
        setIsShuffled(isShuffledStorage ?? false);
        await TrackPlayer.setRepeatMode(repeatModeStorage ?? RepeatMode.Off);
        await TrackPlayer.skip(playingTrackIndex ?? 0);
      }
      setIsPlayerSetup(true);
    }
  };

  const loadPlaylistsFromStorage = () => {
    const storagePlaylists = StorageService.getInstance().loadPlaylists();

    if (storagePlaylists) {
      setPlaylists(storagePlaylists);
    }
  };

  useEffect(() => {
    requestStoragePermission();
    setupTrackPlayer();
    loadPlaylistsFromStorage();
  }, []);

  return (
    <AppContext.Provider
      value={{
        queue,
        setQueue,
        repeatMode,
        setRepeatMode,
        queueName,
        setQueueName,
        playingQueueFrom,
        setPlayingQueueFrom,
        isShuffled,
        setIsShuffled,
        startQueue,
        setStartQueue,
        isPlayerSetup,
        setIsPlayerSetup,
        recentSongs,
        setRecentSongs,
        playlists,
        setPlaylists,
        loadPlaylistsFromStorage,
      }}>
      {children}
      <AppWideEventListener />
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used within AppContext.Provider');
  }

  return context;
};
