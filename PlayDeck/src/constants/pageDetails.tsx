import React from 'react';
import {RenderPageWithPlayer} from '../components/RenderPageWithPlayer';
import {HomePage} from '../pages/HomePage';
import {StyleSheet} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {LibraryPage} from '../pages/LibraryPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const HomePageDetails = {
  name: 'Home',
  Page: () => (
    <RenderPageWithPlayer page={<HomePage />} style={styles.container} />
  ),
  icon: ({color}: {color: string}) => (
    <IconAnt name="home" color={color} size={24} />
  ),
};

export const LibraryPageDetails = {
  name: 'Home',
  Page: () => (
    <RenderPageWithPlayer page={<LibraryPage />} style={styles.container} />
  ),
  icon: ({color}: {color: string}) => (
    <IconMaterial name="library-music" color={color} size={24} />
  ),
};
