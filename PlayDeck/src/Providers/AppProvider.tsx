import React, {createContext, useContext, useEffect, useState} from 'react';
import {AppState} from '../schema/appState';
import TrackPlayer, {Track} from 'react-native-track-player';
import {setupPlayer} from '../services/PlaybackService';
import {shuffleArray} from '../utils/shuffle';
import {requestStoragePermission} from '../utils/requestPermissions';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [startQueue, setStartQueue] = useState<Track[] | null>(null);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [queue, setQueue] = useState<Track[] | null>(null);

  const setupTrackPlayer = async () => {
    const isSetup = await setupPlayer();

    if (isSetup) {
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
      }}>
      {children}
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
