import React, {createContext, useContext, useEffect, useState} from 'react';
import {AppState} from '../schema/appState';
import TrackPlayer, {Track} from 'react-native-track-player';
import {setupPlayer} from '../services/PlaybackService';
import {musicQueue} from '../constants/musicQueue';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [startQueue, setStartQueue] = useState<Track[] | null>(null);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [queue, setQueue] = useState<Track[] | null>(null);

  const setupTrackPlayer = async () => {
    const isSetup = await setupPlayer();

    if (isSetup) {
      await TrackPlayer.add(musicQueue);
      setStartQueue(musicQueue);
      setQueue(musicQueue);
      setIsPlayerSetup(true);
    }
  };

  useEffect(() => {
    setupTrackPlayer();
  }, []);

  return (
    <AppContext.Provider
      value={{
        queue,
        setQueue,
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
