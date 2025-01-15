import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {useActiveTrack, useProgress} from 'react-native-track-player';
import {formatTime} from '../utils/formatTime';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
  },
  titleSmall: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    gap: 16,
    height: '100%',
  },
  artwork: {
    height: 'auto',
    width: 'auto',
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
  },
});

export const SongInfo = () => {
  const track = useActiveTrack();
  const {position, duration} = useProgress(1000);

  if (!track) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No track playing</Text>
        <Text style={styles.text}>-/-</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {track.artwork ? (
        <>
          <View style={styles.titleContainer}>
            <Image source={{uri: track.artwork}} style={styles.artwork} />
          </View>
          <Text style={[styles.text, styles.titleSmall]}>{track.title}</Text>
          <Text style={styles.text}>
            {`${formatTime(position)} / ${formatTime(duration)}`}
          </Text>
        </>
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Text style={[styles.text, styles.title]}>{track.title}</Text>
          </View>
          <Text style={styles.text}>
            {`${formatTime(position)} / ${formatTime(duration)}`}
          </Text>
        </>
      )}
    </View>
  );
};
