import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import TrackPlayer, {Event} from 'react-native-track-player';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {QueueItem} from './QueueItem';
import {useAppState} from '../Providers/AppProvider';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

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
  const {height: screenHeight} = Dimensions.get('window');
  const eightyPercentHeight = screenHeight * 0.8;

  useEffect(() => {
    (async () => {
      const ati = await TrackPlayer.getActiveTrackIndex();
      setCurrentTrackIndex(ati);
    })();
  }, []);

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, ({index}) => {
    setCurrentTrackIndex(index);
  });

  const playFromQueue = async (index: number) => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    setCurrentTrackIndex(index);
  };

  const offset = useSharedValue<number>(0);
  const dragging = useSharedValue<boolean>(false);
  const showQueue = useSharedValue<boolean>(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      dragging.value = true;
    })
    .onChange(event => {
      offset.value = showQueue.value
        ? event.translationY - eightyPercentHeight
        : event.translationY;
    })
    .onFinalize(() => {
      if (offset.value < -eightyPercentHeight / 2) {
        offset.value = withTiming(-eightyPercentHeight);
        showQueue.value = true;
      } else {
        offset.value = withTiming(0);
        showQueue.value = false;
      }
      dragging.value = false;
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {})
    .onFinalize(() => {
      if (!dragging.value) {
        if (showQueue.value) {
          offset.value = withTiming(0);
          showQueue.value = false;
        } else {
          offset.value = withTiming(-eightyPercentHeight);
          showQueue.value = true;
        }
      }
    });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateY: Math.max(Math.min(-64, offset.value), -eightyPercentHeight)},
    ],
    height: Math.min(Math.max(64, -offset.value), eightyPercentHeight),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.queueIcon}>
          <IconMaterial name="queue-music" size={32} color="#E6C72E" />
        </View>
      </GestureDetector>
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
    </Animated.View>
  );
};
