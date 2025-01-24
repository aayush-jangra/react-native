import {Track} from 'react-native-track-player';
import RNFS from 'react-native-fs';

export const convertMusicFilesIntoTracks = (
  musicFiles: RNFS.ReadDirItem[],
): Track[] => {
  const songs = musicFiles.map(file => {
    const track: Track = {
      url: file.path,
      title: file.name,
    };

    return track;
  });

  return songs;
};
