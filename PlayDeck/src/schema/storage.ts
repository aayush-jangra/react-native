import {SortSongOrder} from 'react-native-get-music-files';
import {RepeatMode, Track} from 'react-native-track-player';

export interface PlayerData {
  playingTrackIndex?: number;
  startQueue?: Track[];
  playingQueue?: Track[];
  isShuffled?: boolean;
  repeatMode?: RepeatMode;
}

export interface PlaylistData {
  name: string;
  numberOfTracks: number;
  durationOfPlaylist: number;
  tracks: Track[];
}

export enum SortSongFields {
  TITLE = 'TITLE',
  DURATION = 'DURATION',
  ARTIST = 'ARTIST',
  GENRE = 'GENRE',
  ALBUM = 'ALBUM',
  DATE_ADDED = 'DATE_ADDED',
}

export interface SortData {
  field: SortSongFields;
  order: SortSongOrder;
}
