import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatTime} from '../utils/formatTime';
import Slider from '@react-native-community/slider';
import {useShuffleQueue} from '../hooks/useShuffleQueue';
import Animated, {AnimatedStyle} from 'react-native-reanimated';
import {StorageService} from '../services/StorageService';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    marginVertical: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 16,
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 16,
    width: '100%',
  },
  iconButton: {
    borderRadius: 48,
    width: 96,
    height: 96,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#002617',
  },
  icon: {
    paddingLeft: 6,
  },
  slider: {flex: 1},
  sliderContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export const Controls = ({
  sliderStyle,
}: {
  sliderStyle: AnimatedStyle<ViewStyle>;
}) => {
  const playerState = usePlaybackState();
  const {position, duration} = useProgress(1000);
  const [repeatMode, setRepeatMode] = useState<RepeatMode | null>(null);
  const {isShuffled, shuffleQueue} = useShuffleQueue();

  const isPlaying = playerState.state === State.Playing;
  const isPaused =
    playerState.state === State.Paused || playerState.state === State.Ready;
  const loading =
    playerState.state === undefined || playerState.state === State.Loading;

  useEffect(() => {
    (async () => {
      const currentRepeatMode = await TrackPlayer.getRepeatMode();
      setRepeatMode(currentRepeatMode);
    })();
  }, []);

  const togglePlay = async () => {
    if (isPaused) {
      await TrackPlayer.play();
    } else if (isPlaying) {
      await TrackPlayer.pause();
    }
  };

  const prevButtonHandle = () => {
    if (position > 5) {
      TrackPlayer.seekTo(0);
    } else {
      TrackPlayer.skipToPrevious();
    }
    TrackPlayer.play();
  };

  const changeRepeatMode = async () => {
    let newRepeatMode = RepeatMode.Off;

    if (repeatMode === RepeatMode.Off) {
      newRepeatMode = RepeatMode.Queue;
    } else if (repeatMode === RepeatMode.Queue) {
      newRepeatMode = RepeatMode.Track;
    }

    TrackPlayer.setRepeatMode(newRepeatMode);
    StorageService.getInstance().setPlayerData({repeatMode: newRepeatMode});
    setRepeatMode(newRepeatMode);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sliderContainer, sliderStyle]}>
        <Text style={styles.text}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          value={position}
          maximumValue={Math.floor(duration)}
          minimumTrackTintColor="#85FDF7"
          maximumTrackTintColor="#BCFEFF"
          thumbTintColor="#E6C72E"
          onSlidingComplete={pos => {
            TrackPlayer.seekTo(pos);
          }}
          disabled={loading}
        />
        <Text style={styles.text}>{formatTime(duration)}</Text>
      </Animated.View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={() => shuffleQueue()}>
          <IconMaterialCommunity
            name="shuffle-variant"
            size={24}
            color={isShuffled ? '#E6C72E' : '#FEFFF2'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={prevButtonHandle}>
          <IconEntypo
            name="controller-jump-to-start"
            size={40}
            color="#E6C72E"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={togglePlay}>
          {loading ? (
            <ActivityIndicator size={60} color="#E6C72E" />
          ) : (
            <>
              {isPlaying ? (
                <IconMaterial name="pause" size={60} color="#E6C72E" />
              ) : (
                <IconEntypo
                  name="controller-play"
                  size={60}
                  color="#E6C72E"
                  style={styles.icon}
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
          <IconEntypo name="controller-next" size={40} color="#E6C72E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeRepeatMode()}>
          {repeatMode === RepeatMode.Track ? (
            <IconMaterialCommunity
              name="repeat-once"
              size={24}
              color="#E6C72E"
            />
          ) : (
            <IconMaterialCommunity
              name="repeat"
              size={24}
              color={repeatMode === RepeatMode.Queue ? '#E6C72E' : '#FEFFF2'}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
