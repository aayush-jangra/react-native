import {Dispatch, SetStateAction} from 'react';
import {Track} from 'react-native-track-player';
import {PlaylistData} from './storage';

export interface PlayNewPlaylistProps {
  tracks: Track[];
  playingFrom: string;
  shuffle?: boolean;
  skipIndex?: number;
}
export interface AppState {
  isShuffled: boolean;
  setIsShuffled: Dispatch<SetStateAction<boolean>>;
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
  playNewPlaylist: ({
    tracks,
    shuffle,
    skipIndex,
  }: PlayNewPlaylistProps) => Promise<void>;
  addItemInPlayingQueueFrom: (item: string) => void;
}
