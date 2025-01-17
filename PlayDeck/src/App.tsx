import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {setupPlayer} from './services/PlaybackService';
import TrackPlayer from 'react-native-track-player';
import {musicQueue} from './constants/musicQueue';
import {Controls} from './components/Controls';
import {SongInfo} from './components/SongInfo';
import {QueueList} from './components/QueueList';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    padding: 4,
  },
  text: {
    color: 'white',
  },
  section: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  queueSection: {
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
  },
});

const App = () => {
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

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
      <LinearGradient
        colors={['#BCFEFF', '#08BF96', '#028C65', '#00593B', '#002617']}
        style={styles.linearGradient}>
        {showQueue ? (
          <View style={styles.section}>
            <QueueList />
          </View>
        ) : (
          <>
            <SongInfo />
            <Controls />
          </>
        )}
        <TouchableOpacity
          style={styles.queueSection}
          onPress={() => setShowQueue(prev => !prev)}>
          <Text style={styles.text}>
            {showQueue ? 'Hide Queue' : 'Show Queue'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default App;
