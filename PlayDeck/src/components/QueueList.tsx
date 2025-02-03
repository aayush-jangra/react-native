import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {QUEUE_TAB_HEIGHT} from '../constants/styles';
import {QueueTracks} from './QueueTracks';
import {SavedQueues} from './SavedQueues';

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
  queueIcon: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export const QueueList = () => {
  const [showTracks, setShowTracks] = useState(true);
  const {height: screenHeight} = Dimensions.get('window');
  const eightyPercentHeight = screenHeight * 0.8;

  const offset = useSharedValue<number>(0);
  const viewHeight = useSharedValue(QUEUE_TAB_HEIGHT);

  useEffect(() => {
    const onBackPress = () => {
      if (viewHeight.value === QUEUE_TAB_HEIGHT) {
        // Allow default behaviour by returing false
        return false;
      }

      viewHeight.value = withTiming(QUEUE_TAB_HEIGHT);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (viewHeight.value === QUEUE_TAB_HEIGHT) {
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
    <>
      <Animated.View style={[styles.container, animatedStyles]}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowTracks(true)}
              style={styles.queueIcon}>
              <IconMaterial
                name="queue-music"
                size={32}
                color={showTracks ? '#E6C72E' : 'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTracks(false)}
              style={styles.queueIcon}>
              <IconMaterial
                name="save"
                size={32}
                color={!showTracks ? '#E6C72E' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </GestureDetector>
        {showTracks ? (
          <QueueTracks />
        ) : (
          <SavedQueues showTracks={() => setShowTracks(true)} />
        )}
      </Animated.View>
    </>
  );
};
