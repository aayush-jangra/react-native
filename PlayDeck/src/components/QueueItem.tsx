import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {formatTime} from '../utils/formatTime';
import {DefaultArtwork} from './DefaultArtwork';
import {Track} from 'react-native-track-player';

interface QueueItemProps {
  item: Track;
  currentTrack?: boolean;
  onPress?: () => void;
  showDuration?: boolean;
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  duration: {
    color: 'gray',
    fontSize: 16,
  },
  queueItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  selectedItem: {
    backgroundColor: '#563900',
  },
  artwork: {
    height: 48,
    width: 48,
    aspectRatio: 1,
    borderRadius: 12,
  },
  details: {
    flex: 1,
  },
});

export const QueueItem = ({
  item,
  currentTrack = false,
  showDuration = true,
  onPress,
}: QueueItemProps) => {
  return (
    <TouchableOpacity
      key={item.title}
      style={[styles.queueItem, currentTrack ? styles.selectedItem : {}]}
      onPress={onPress}>
      {item.artwork ? (
        <Image source={{uri: item.artwork}} style={styles.artwork} />
      ) : (
        <DefaultArtwork size="small" />
      )}
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.text}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.text}>
          {item.artist}
        </Text>
      </View>
      {showDuration && (
        <Text style={styles.duration}>
          {item.duration ? formatTime(item.duration) : '-- / --'}
        </Text>
      )}
    </TouchableOpacity>
  );
};
