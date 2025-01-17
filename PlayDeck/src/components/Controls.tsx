import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {shuffleArray} from '../utils/shuffle';
import {formatTime} from '../utils/formatTime';
import Slider from '@react-native-community/slider';

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

export const Controls = () => {
  const playerState = usePlaybackState();
  const {position, duration} = useProgress(1000);
  const [repeatMode, setRepeatMode] = useState<RepeatMode | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const unshuffledQueue = useRef<Track[] | null>(null);

  const loading = playerState.state === undefined;
  const isPlaying = !loading && playerState.state === State.Playing;
  const isPaused =
    !loading &&
    (playerState.state === State.Paused || playerState.state === State.Ready);

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

  const shuffleQueue = async () => {
    const playingPosition = position;
    const [queue, playingIndex] = await Promise.all([
      TrackPlayer.getQueue(),
      TrackPlayer.getActiveTrackIndex(),
    ]);

    if (isShuffled && unshuffledQueue.current) {
      const newTrackIndex =
        playingIndex !== undefined
          ? unshuffledQueue.current.findIndex(
              track => track.title === queue[playingIndex].title,
            )
          : 0;

      await TrackPlayer.setQueue(unshuffledQueue.current);
      setIsShuffled(false);
      await TrackPlayer.skip(newTrackIndex, playingPosition);
    } else {
      unshuffledQueue.current = queue;

      let startTrack: Track | null = null;

      if (playingIndex !== undefined) {
        startTrack = queue.splice(playingIndex, 1)[0];
      }
      shuffleArray(queue);
      if (startTrack) {
        queue.unshift(startTrack);
      }
      setIsShuffled(true);

      await TrackPlayer.setQueue(queue);
      await TrackPlayer.skip(0, playingPosition);
    }
  };

  const changeRepeatMode = async () => {
    switch (repeatMode) {
      case RepeatMode.Off:
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        setRepeatMode(RepeatMode.Queue);
        break;
      case RepeatMode.Queue:
        TrackPlayer.setRepeatMode(RepeatMode.Track);
        setRepeatMode(RepeatMode.Track);
        break;
      case RepeatMode.Track:
        TrackPlayer.setRepeatMode(RepeatMode.Off);
        setRepeatMode(RepeatMode.Off);
        break;
      default:
        TrackPlayer.setRepeatMode(RepeatMode.Off);
        setRepeatMode(RepeatMode.Off);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
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
      </View>
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
