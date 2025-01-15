import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    gap: 16,
    height: '100%',
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

  const loading = playerState.state === undefined;
  const isPlaying = !loading && playerState.state === State.Playing;
  const isPaused =
    !loading &&
    (playerState.state === State.Paused || playerState.state === State.Ready);

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
  };

  return (
    <View style={styles.container}>
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
        onPress={() => TrackPlayer.skipToNext()}>
        <Text style={styles.text}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};
