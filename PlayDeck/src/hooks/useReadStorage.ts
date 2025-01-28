import {useEffect, useState} from 'react';
import {check, PERMISSIONS} from 'react-native-permissions';
import {Track} from 'react-native-track-player';
import {convertMusicFilesIntoTracks} from '../utils/convertMusicFilesIntoTracks';
import {getAll} from 'react-native-get-music-files';
import {Platform} from 'react-native';

export const useLoadSongsFromStorage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<Track[] | null>(null);
  const [error, setError] = useState<{
    type: 'Permission' | 'Reading';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      const readPermission =
        Platform.OS === 'android' && Platform.Version >= 33
          ? await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)
          : await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (readPermission === 'granted') {
        try {
          const musicFiles = await getAll({
            minSongDuration: 30000,
          });
          if (typeof musicFiles === 'string') {
            throw new Error('No music files found');
          }
          const tracks = convertMusicFilesIntoTracks(musicFiles);
          setSongs(tracks);
          setError(null);
          setIsLoading(false);
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
