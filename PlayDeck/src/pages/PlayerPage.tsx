import React from 'react';
import {Controls} from '../components/Controls';
import {SongInfo} from '../components/SongInfo';
import {QueueList} from '../components/QueueList';
import {Dimensions, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {MiniPlayer} from '../components/MiniPlayer';
import {MINIPLAYER_HEIGHT} from '../constants/styles';

const styles = StyleSheet.create({
  queueSpace: {
    height: 64,
  },
  container: {
    flex: 1,
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
  },
  extend: {
    flex: 1,
  },
  collapse: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  queueContainer: {
    position: 'relative',
  },
});

export const PlayerPage = () => {
  const {height: screenHeight} = Dimensions.get('window');
  const offset = useSharedValue(0);
  const viewHeight = useSharedValue(MINIPLAYER_HEIGHT);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      offset.value = event.translationY;
    })
    .onFinalize(() => {
      if (offset.value < -250) {
        viewHeight.value = withTiming(screenHeight + MINIPLAYER_HEIGHT);
      } else if (offset.value > 250) {
        viewHeight.value = withTiming(MINIPLAYER_HEIGHT);
      }
      offset.value = withTiming(0);
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (viewHeight.value === MINIPLAYER_HEIGHT) {
      viewHeight.value = withTiming(screenHeight + MINIPLAYER_HEIGHT);
    }
  });

  const miniPlayerGesture = Gesture.Exclusive(panGesture, tapGesture);

  const panGestureInternal = Gesture.Pan()
    .onChange(event => {
      offset.value = event.translationY;
    })
    .onFinalize(() => {
      if (offset.value < -250) {
        viewHeight.value = withTiming(screenHeight + MINIPLAYER_HEIGHT);
      } else if (offset.value > 250) {
        viewHeight.value = withTiming(MINIPLAYER_HEIGHT);
      }
      offset.value = withTiming(0);
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.min(
          -MINIPLAYER_HEIGHT,
          Math.max(offset.value - viewHeight.value, -screenHeight - 64),
        ),
      },
    ],
    height: Math.max(
      MINIPLAYER_HEIGHT,
      Math.min(viewHeight.value - offset.value, screenHeight + 64),
    ),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <GestureDetector gesture={miniPlayerGesture}>
        <MiniPlayer />
      </GestureDetector>
      <LinearGradient
        colors={['#BCFEFF', '#08BF96', '#028C65', '#00593B', '#002617']}
        style={styles.extend}>
        <GestureDetector gesture={panGestureInternal}>
          <View style={styles.extend}>
            <SongInfo />
          </View>
        </GestureDetector>
        <Controls />
        <View style={styles.queueSpace} />
        <View>
          <QueueList />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
