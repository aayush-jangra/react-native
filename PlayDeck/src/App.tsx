import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {setupPlayer} from './services/PlaybackService';
import TrackPlayer from 'react-native-track-player';
import {musicQueue} from './constants/musicQueue';
import {Controls} from './components/Controls';
import {SongInfo} from './components/SongInfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    height: '50%',
    width: '100%',
  },
});

const App = () => {
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);

  const setupTrackPlayer = async () => {
    const isSetup = await setupPlayer();

    if (isSetup) {
      await TrackPlayer.add(musicQueue);
      setIsPlayerSetup(true);
    }
  };

  useEffect(() => {
    setupTrackPlayer();
  }, []);

  if (!isPlayerSetup) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <SongInfo />
      </View>
      <View style={styles.section}>
        <Controls />
      </View>
    </SafeAreaView>
  );
};

export default App;
