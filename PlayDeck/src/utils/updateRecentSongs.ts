import {Track} from 'react-native-track-player';
import {RECENT_SONGS_MAX_LEN} from '../constants/data';

export const updateRecentSongs = (songs: Track[], track: Track) => {
  const updatedList = [track, ...songs];

  for (let i = 1; i < updatedList.length; i++) {
    if (updatedList[i].url === track.url) {
      updatedList.splice(i, 1);
      break;
    }
  }

  if (updatedList.length > RECENT_SONGS_MAX_LEN) {
    updatedList.splice(RECENT_SONGS_MAX_LEN);
  }

  return updatedList;
};
