import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {QueueItem} from './QueueItem';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {MINIPLAYER_HEIGHT} from '../constants/styles';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MINIPLAYER_HEIGHT,
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  extend: {
    flex: 1,
  },
  noSongText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    paddingHorizontal: 32,
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF00',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  relativeView: {
    position: 'relative',
  },
  paddingRight: {
    paddingRight: 16,
  },
  timer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: MINIPLAYER_HEIGHT,
  },
});

export const MiniPlayer = () => {
  const {position, duration} = useProgress(1000);
  const playerState = usePlaybackState();

  const [currentTrack, setCurrentTrack] = useState<Track | undefined>();

  const loading = playerState.state === undefined;
  const isPlaying = !loading && playerState.state === State.Playing;
  const isPaused =
    !loading &&
    (playerState.state === State.Paused || playerState.state === State.Ready);

  useEffect(() => {
    (async () => {
      const ct = await TrackPlayer.getActiveTrack();
      setCurrentTrack(ct);
    })();
  }, []);

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, ({track}) => {
    setCurrentTrack(track);
  });

  const prevButtonHandle = () => {
    if (position > 5) {
      TrackPlayer.seekTo(0);
    } else {
      TrackPlayer.skipToPrevious();
    }
    TrackPlayer.play();
  };

  const togglePlay = async () => {
    if (isPaused) {
      await TrackPlayer.play();
    } else if (isPlaying) {
      await TrackPlayer.pause();
    }
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {})
    .onEnd(() => {})
    .shouldCancelWhenOutside(true);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${Math.floor((position / duration) * 200)}%`,
  }));

  return (
    <View style={styles.container}>
      {currentTrack ? (
        <View style={[styles.fill, styles.relativeView]}>
          <Animated.View style={[styles.timer, animatedStyles]}>
            <LinearGradient
              style={styles.extend}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#00593B', '#000', '#000']}
              locations={[0.5, 0.6, 1]}>
              {}
            </LinearGradient>
          </Animated.View>
          <View style={[styles.fill, styles.paddingRight]}>
            <View style={styles.extend}>
              <QueueItem item={currentTrack} showDuration={false} />
            </View>
            <GestureDetector gesture={tapGesture}>
              <View style={styles.controls}>
                <TouchableOpacity onPress={prevButtonHandle}>
                  <IconEntypo
                    name="controller-jump-to-start"
                    size={40}
                    color="#E6C72E"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlay}>
                  {loading ? (
                    <ActivityIndicator size={64} color="#E6C72E" />
                  ) : (
                    <>
                      {isPlaying ? (
                        <IconMaterial name="pause" size={64} color="#E6C72E" />
                      ) : (
                        <IconEntypo
                          name="controller-play"
                          size={64}
                          color="#E6C72E"
                        />
                      )}
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    TrackPlayer.skipToNext();
                    TrackPlayer.play();
                  }}>
                  <IconEntypo
                    name="controller-next"
                    size={40}
                    color="#E6C72E"
                  />
                </TouchableOpacity>
              </View>
            </GestureDetector>
          </View>
        </View>
      ) : (
        <Text style={styles.noSongText}>Nothing is playing</Text>
      )}
    </View>
  );
};
