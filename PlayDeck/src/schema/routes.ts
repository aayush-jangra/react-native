import {PlaylistData} from './storage';

export type RootTabParamList = {
  Home: undefined;
  Library: undefined;
  Playlists: undefined;
};

export type PlaylistStackParamList = {
  AllPlaylists: undefined;
  SinglePlaylist: PlaylistData;
};
