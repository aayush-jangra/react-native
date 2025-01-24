import React from 'react';
import {HomePage} from '../pages/HomePage';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {LibraryPage} from '../pages/LibraryPage';

export const HomePageDetails = {
  name: 'Home',
  Page: HomePage,
  icon: ({color}: {color: string}) => (
    <IconAnt name="home" color={color} size={24} />
  ),
};

export const LibraryPageDetails = {
  name: 'Home',
  Page: LibraryPage,
  icon: ({color}: {color: string}) => (
    <IconMaterial name="library-music" color={color} size={24} />
  ),
};
