import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {useActiveTrack} from 'react-native-track-player';
import {DefaultArtwork} from './DefaultArtwork';

const styles = StyleSheet.create({
  songName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FEFFF2',
  },
  songDetails: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FEFFF2',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 16,
    flex: 1,
  },
  artwork: {
    height: 'auto',
    width: '80%',
    aspectRatio: 1,
    borderRadius: 16,
    elevation: 10,
  },
  songInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});

export const SongInfo = () => {
  const track = useActiveTrack();

  if (!track) {
    return (
      <View style={styles.container}>
        <Text style={styles.songName}>No track playing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {track.artwork ? (
        <Image source={{uri: track.artwork}} style={styles.artwork} />
      ) : (
        <DefaultArtwork />
      )}
      <View style={styles.songInfo}>
        <Text style={styles.songName}>{track.title}</Text>
        {track.artist ? (
          <Text numberOfLines={1} style={styles.songDetails}>
            {track.artist}
          </Text>
        ) : (
          <Text style={styles.songDetails}>{''}</Text>
        )}
        {track.album ? (
          <Text numberOfLines={1} style={styles.songDetails}>
            {track.album}
          </Text>
        ) : (
          <Text style={styles.songDetails}>{''}</Text>
        )}
      </View>
    </View>
  );
};
