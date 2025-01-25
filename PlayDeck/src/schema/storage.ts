import {RepeatMode, Track} from 'react-native-track-player';

export interface PlayerData {
  playingTrackIndex?: number;
  startQueue?: Track[];
  playingQueue?: Track[];
  isShuffled?: boolean;
  repeatMode?: RepeatMode;
}
