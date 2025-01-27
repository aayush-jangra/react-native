import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {AllPlaylists} from './AllPlaylists';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PlaylistStackParamList} from '../../schema/routes';
import {SinglePlaylist} from './SinglePlaylist';

const Stack = createNativeStackNavigator<PlaylistStackParamList>();

const styles = StyleSheet.create({
  container: {flex: 1, display: 'flex'},
});

export const PlaylistPage = () => {
  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={styles.container}>
      <Stack.Navigator
        initialRouteName="AllPlaylists"
        screenOptions={{
          animation: 'slide_from_right',
          headerShown: false,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="AllPlaylists" component={AllPlaylists} />
        <Stack.Screen name="SinglePlaylist" component={SinglePlaylist} />
      </Stack.Navigator>
    </LinearGradient>
  );
};
