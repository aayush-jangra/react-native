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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 4,
  },
  text: {
    color: 'white',
  },
  section: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
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
      {showQueue ? (
        <View style={styles.section}>
          <QueueList />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <SongInfo />
          </View>
          <View style={styles.section}>
            <Controls />
          </View>
        </>
      )}
      <TouchableOpacity
        style={styles.queueSection}
        onPress={() => setShowQueue(prev => !prev)}>
        <Text style={styles.text}>
          {showQueue ? 'Hide Queue' : 'Show Queue'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
