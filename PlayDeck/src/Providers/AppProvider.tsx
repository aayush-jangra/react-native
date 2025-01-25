import React, {createContext, useContext, useEffect, useState} from 'react';
import {AppState} from '../schema/appState';
import TrackPlayer, {RepeatMode, Track} from 'react-native-track-player';
import {setupPlayer} from '../services/PlaybackService';
import {shuffleArray} from '../utils/shuffle';
import {requestStoragePermission} from '../utils/requestPermissions';
import {StorageService} from '../services/StorageService';
import {AppWideEventListener} from '../components/AppWideEventListener';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [startQueue, setStartQueue] = useState<Track[] | null>(null);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [queue, setQueue] = useState<Track[] | null>(null);
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
          repeatMode,
        } = storagePlayerData;
        setQueue(playingQueue ?? null);
        setStartQueue(startQueueStorage ?? null);
        if (playingQueue) {
          await TrackPlayer.reset();
          await TrackPlayer.add(playingQueue);
        }
        setIsShuffled(isShuffledStorage ?? false);
        await TrackPlayer.setRepeatMode(repeatMode ?? RepeatMode.Off);
        await TrackPlayer.skip(playingTrackIndex ?? 0);
      }
      setIsPlayerSetup(true);
    }
  };

  useEffect(() => {
    requestStoragePermission();
    setupTrackPlayer();
  }, []);

  const playNewPlaylist = async ({
    tracks,
    shuffle = false,
    skipIndex = 0,
  }: {
    tracks: Track[];
    shuffle?: boolean;
    skipIndex?: number;
  }) => {
    const newPlaylist = [...tracks];
    setStartQueue([...tracks]);
    if (shuffle) {
      shuffleArray(newPlaylist);
      setIsShuffled(true);
    }
    await TrackPlayer.reset();
    await TrackPlayer.add(newPlaylist);
    await TrackPlayer.skip(skipIndex);
    setQueue(newPlaylist);
    await TrackPlayer.play();
    StorageService.getInstance().setPlayerData({
      playingTrackIndex: skipIndex,
      startQueue: [...tracks],
      playingQueue: [...newPlaylist],
      isShuffled: shuffle,
    });
  };

  return (
    <AppContext.Provider
      value={{
        queue,
        setQueue,
        playNewPlaylist,
        isShuffled,
        setIsShuffled,
        startQueue,
        setStartQueue,
        isPlayerSetup,
        setIsPlayerSetup,
        recentSongs,
        setRecentSongs,
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
