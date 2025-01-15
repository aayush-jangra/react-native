import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useActiveTrack, useProgress} from 'react-native-track-player';
import {formatTime} from '../utils/formatTime';

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    gap: 16,
    height: '100%',
  },
});

export const SongInfo = () => {
  const track = useActiveTrack();
  const {position, duration} = useProgress(1000);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {track ? track.title : 'No track playing'}
      </Text>
      <Text style={styles.text}>
        {track ? `${formatTime(position)} / ${formatTime(duration)}` : '-/-'}
      </Text>
    </View>
  );
};
