import React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {LibraryPage} from '../pages/Library/LibraryPage';
import {PlaylistPage} from '../pages/Playlist/PlaylistPage';

export const PlaylistPageDetails = {
  name: 'Playlist',
  Page: PlaylistPage,
  icon: ({color}: {color: string}) => (
    <IconMaterialCommunity name="playlist-music" color={color} size={24} />
  ),
};

export const LibraryPageDetails = {
  name: 'Home',
  Page: LibraryPage,
  icon: ({color}: {color: string}) => (
    <IconMaterial name="library-music" color={color} size={24} />
  ),
};
