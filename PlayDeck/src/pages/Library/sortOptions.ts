import {SortSongOrder} from 'react-native-get-music-files';
import {SortData, SortSongFields} from '../../schema/storage';

export type SortOptions = 'a2z' | 'z2a' | 'recentlyAdded' | 'oldestAdded';

export const SortOptionsMap: {[key in SortOptions]: SortData} = {
  a2z: {
    field: SortSongFields.TITLE,
    order: SortSongOrder.ASC,
  },
  z2a: {
    field: SortSongFields.TITLE,
    order: SortSongOrder.DESC,
  },
  recentlyAdded: {
    field: SortSongFields.DATE_ADDED,
    order: SortSongOrder.DESC,
  },
  oldestAdded: {
    field: SortSongFields.DATE_ADDED,
    order: SortSongOrder.ASC,
  },
};
