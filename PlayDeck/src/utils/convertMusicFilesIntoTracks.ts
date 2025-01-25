import {Track} from 'react-native-track-player';
import {Song} from 'react-native-get-music-files/lib/typescript/src/NativeTurboSongs';

export const convertMusicFilesIntoTracks = (musicFiles: Song[]): Track[] => {
  const songs = musicFiles.map(file => {
    const track: Track = {
      ...file,
      artwork: file.cover ? file.cover : undefined,
      duration: file.duration / 1000,
    };

    return track;
  });

  return songs;
};
