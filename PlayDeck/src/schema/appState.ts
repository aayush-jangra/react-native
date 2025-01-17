import {Dispatch, SetStateAction} from 'react';
import {Track} from 'react-native-track-player';

export interface AppState {
  isShuffled: boolean;
  setIsShuffled: Dispatch<SetStateAction<boolean>>;
  isPlayerSetup: boolean;
  setIsPlayerSetup: Dispatch<SetStateAction<boolean>>;
  startQueue: Track[] | null;
  setStartQueue: Dispatch<SetStateAction<Track[] | null>>;
}
