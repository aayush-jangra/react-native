import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from 'react-native';
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
import {QUEUE_TAB_HEIGHT} from '../constants/styles';

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
    height: 64,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQueue: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQueueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedItem: {
    backgroundColor: '#563900',
  },
  queueContainer: {
    paddingHorizontal: 32,
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
  const viewHeight = useSharedValue(QUEUE_TAB_HEIGHT);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      offset.value = event.translationY;
    })
    .onFinalize(() => {
      if (offset.value < -250) {
        viewHeight.value = withTiming(eightyPercentHeight);
      } else if (offset.value > 250) {
        viewHeight.value = withTiming(QUEUE_TAB_HEIGHT);
      }
      offset.value = withTiming(0);
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {})
    .onEnd(() => {
      if (viewHeight.value === eightyPercentHeight) {
        viewHeight.value = withTiming(QUEUE_TAB_HEIGHT);
      } else {
        viewHeight.value = withTiming(eightyPercentHeight);
      }
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.min(
          -QUEUE_TAB_HEIGHT,
          Math.max(offset.value - viewHeight.value, -eightyPercentHeight),
        ),
      },
    ],
    height: Math.max(
      QUEUE_TAB_HEIGHT,
      Math.min(viewHeight.value - offset.value, eightyPercentHeight),
    ),
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
            const currentTrack =
              currentTrackIndex !== null && currentTrackIndex === index;

            return (
              <View
                style={[
                  styles.queueContainer,
                  currentTrack ? styles.selectedItem : {},
                ]}>
                <QueueItem
                  key={item.url}
                  item={item}
                  onPress={() => playFromQueue(index)}
                />
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.emptyQueue}>
          <IconMaterial name="music-off" size={128} color="#E82315" />
          <Text style={styles.emptyQueueText}>Nothing is playing</Text>
        </View>
      )}
    </Animated.View>
  );
};
