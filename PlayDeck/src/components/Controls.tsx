import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {shuffleArray} from '../utils/shuffle';

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    gap: 16,
    height: '100%',
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    gap: 16,
  },
  button: {
    borderColor: 'white',
    borderRadius: 12,
    flex: 1,
    padding: 8,
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#333',
  },
});

export const Controls = () => {
  const playerState = usePlaybackState();
  const {position} = useProgress();
  const [repeatMode, setRepeatMode] = useState<RepeatMode | null>(null);

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

    let startTrack: Track | null = null;

    if (playingIndex !== undefined) {
      startTrack = queue.splice(playingIndex, 1)[0];
    }
    shuffleArray(queue);
    if (startTrack) {
      queue.unshift(startTrack);
    }

    await TrackPlayer.setQueue(queue);
    await TrackPlayer.skip(0, playingPosition);
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
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={prevButtonHandle}>
          <Text style={styles.text}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={togglePlay}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            TrackPlayer.skipToNext();
            TrackPlayer.play();
          }}>
          <Text style={styles.text}>Next</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => shuffleQueue()}>
          <Text style={styles.text}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeRepeatMode()}>
          <Text style={styles.text}>{`Repeat-${
            repeatMode !== null ? RepeatMode[repeatMode] : 'X'
          }`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
