import React, {createContext, useContext, useEffect, useState} from 'react';
import {AppState, PlayNewPlaylistProps} from '../schema/appState';
import TrackPlayer, {RepeatMode, Track} from 'react-native-track-player';
import {setupPlayer} from '../services/PlaybackService';
import {shuffleArray} from '../utils/shuffle';
import {requestStoragePermission} from '../utils/requestPermissions';
import {StorageService} from '../services/StorageService';
import {AppWideEventListener} from '../components/AppWideEventListener';
import {PlaylistData} from '../schema/storage';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [startQueue, setStartQueue] = useState<Track[] | null>(null);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [queue, setQueue] = useState<Track[] | null>(null);
  const [playingQueueFrom, setPlayingQueueFrom] = useState<string[]>([]);
  const [recentSongs, setRecentSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);

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
          playingFrom,
        } = storagePlayerData;
        setQueue(playingQueue ?? null);
        setPlayingQueueFrom(playingFrom || []);
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

  const playNewPlaylist = async ({
    tracks,
    playingFrom,
    shuffle = false,
    skipIndex = 0,
  }: PlayNewPlaylistProps) => {
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
    setPlayingQueueFrom([playingFrom]);
    await TrackPlayer.play();
    StorageService.getInstance().setPlayerData({
      playingFrom: [playingFrom],
      playingTrackIndex: skipIndex,
      startQueue: [...tracks],
      playingQueue: [...newPlaylist],
      isShuffled: shuffle,
    });
  };

  const addItemInPlayingQueueFrom = (item: string) => {
    const newPlayingFrom = playingQueueFrom.some(value => value === item)
      ? [...playingQueueFrom]
      : [...playingQueueFrom, item];
    setPlayingQueueFrom(newPlayingFrom);
    StorageService.getInstance().setPlayerData({
      playingFrom: newPlayingFrom,
    });
  };

  return (
    <AppContext.Provider
      value={{
        queue,
        setQueue,
        playingQueueFrom,
        playNewPlaylist,
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
        addItemInPlayingQueueFrom,
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
