import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {formatTime} from '../utils/formatTime';
import {Track} from 'react-native-track-player';
import IconEntypo from 'react-native-vector-icons/Entypo';

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
  },
  duration: {
    color: '#18F2CE',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  queueItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
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
  secondaryInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
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
        <Image
          source={require('../assets/images/noMusic.jpg')}
          style={styles.artwork}
        />
      )}
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.text}>
          {item.title}
        </Text>
        <View style={styles.secondaryInfo}>
          <Text numberOfLines={1} style={styles.text}>
            {item.artist}
          </Text>
          {showDuration && (
            <>
              <IconEntypo name="dot-single" size={18} color={'white'} />
              <Text style={styles.duration}>
                {item.duration ? formatTime(item.duration) : '-- / --'}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
