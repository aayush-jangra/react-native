import {Dispatch, SetStateAction} from 'react';
import {RepeatMode, Track} from 'react-native-track-player';
import {PlaylistData} from './storage';

export interface AppState {
  isShuffled: boolean;
  setIsShuffled: Dispatch<SetStateAction<boolean>>;
  repeatMode: RepeatMode;
  setRepeatMode: Dispatch<SetStateAction<RepeatMode>>;
  isPlayerSetup: boolean;
  setIsPlayerSetup: Dispatch<SetStateAction<boolean>>;
  startQueue: Track[] | null;
  setStartQueue: Dispatch<SetStateAction<Track[] | null>>;
  queue: Track[] | null;
  setQueue: Dispatch<SetStateAction<Track[] | null>>;
  queueName: string | undefined;
  setQueueName: Dispatch<SetStateAction<string | undefined>>;
  recentSongs: Track[];
  setRecentSongs: Dispatch<SetStateAction<Track[]>>;
  playlists: PlaylistData[];
  setPlaylists: Dispatch<SetStateAction<PlaylistData[]>>;
  loadPlaylistsFromStorage: () => void;
  playingQueueFrom: string[];
  setPlayingQueueFrom: React.Dispatch<React.SetStateAction<string[]>>;
}
