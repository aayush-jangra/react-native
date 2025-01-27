import React from 'react';
import {HomePage} from '../pages/HomePage';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {LibraryPage} from '../pages/Library/LibraryPage';
import {PlaylistPage} from '../pages/Playlist/PlaylistPage';

export const HomePageDetails = {
  name: 'Home',
  Page: HomePage,
  icon: ({color}: {color: string}) => (
    <IconAnt name="home" color={color} size={24} />
  ),
};

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
