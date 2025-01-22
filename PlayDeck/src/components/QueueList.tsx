import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import TrackPlayer, {Event} from 'react-native-track-player';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {QueueItem} from './QueueItem';
import {useAppState} from '../Providers/AppProvider';

const QUEUE_BUTTON_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 16,
    position: 'absolute',
    left: 0,
    top: '100%',
    width: '100%',
    backgroundColor: '#001712',
    borderColor: '#E6C72E',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    elevation: 100,
  },
  loading: {
    height: '100%',
    width: '100%',
  },
  list: {
    flex: 1,
    width: '100%',
    display: 'flex',
    gap: 8,
  },
  queueIcon: {
    height: QUEUE_BUTTON_HEIGHT,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const QueueList = () => {
  const {queue} = useAppState();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<
    number | undefined
  >();
  const [showQueue, setShowQueue] = useState(false);
  const {height: screenHeight} = Dimensions.get('window');
  const eightyPercentHeight = screenHeight * 0.8;

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, ({index}) => {
    setCurrentTrackIndex(index);
  });

  const playFromQueue = async (index: number) => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    setCurrentTrackIndex(index);
  };

  return (
    <View
      style={[
        styles.container,
        showQueue
          ? {
              height: eightyPercentHeight,
              transform: [{translateY: -eightyPercentHeight}],
            }
          : {
              height: QUEUE_BUTTON_HEIGHT,
              transform: [{translateY: -QUEUE_BUTTON_HEIGHT}],
            },
      ]}>
      <Pressable
        style={styles.queueIcon}
        onPress={() => setShowQueue(prev => !prev)}>
        <IconMaterial name="queue-music" size={32} color="#E6C72E" />
      </Pressable>
      {queue ? (
        <FlatList
          style={styles.list}
          data={queue}
          renderItem={({item, index}) => {
            return (
              <QueueItem
                key={item.title}
                item={item}
                currentTrack={
                  currentTrackIndex !== null && currentTrackIndex === index
                }
                onPress={() => playFromQueue(index)}
              />
            );
          }}
        />
      ) : (
        <ActivityIndicator style={styles.loading} size={96} />
      )}
    </View>
  );
};
