import {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import {check, PERMISSIONS} from 'react-native-permissions';
import {Track} from 'react-native-track-player';
import {convertMusicFilesIntoTracks} from '../utils/convertMusicFilesIntoTracks';

export const useLoadSongsFromStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Track[] | null>(null);
  const [error, setError] = useState<{
    type: 'Permission' | 'Reading';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const readPermission = await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);

      if (readPermission === 'granted') {
        try {
          const path = RNFS.DownloadDirectoryPath;

          const files = await RNFS.readDir(path);
          const musicFiles = files.filter(
            file => file.isFile() && file.name.endsWith('.mp3'),
          );
          setIsLoading(false);
          const s = convertMusicFilesIntoTracks(musicFiles);
          setSongs(s);
          setError(null);
        } catch (err) {
          setIsLoading(false);
          setError({type: 'Reading', message: (err as Error).message});
        }
      } else {
        setIsLoading(false);
        setError({
          type: 'Permission',
          message: 'Failed to get Read Permission',
        });
      }
    };

    fetchSongs();
  }, []);

  return {isLoading, songs, error};
};
