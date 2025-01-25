import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {formatTime} from '../utils/formatTime';
import {Track} from 'react-native-track-player';
import IconEntypo from 'react-native-vector-icons/Entypo';

interface QueueItemProps {
  item: Track;
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
    alignItems: 'center',
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
  showDuration = true,
  onPress,
}: QueueItemProps) => {
  return (
    <TouchableOpacity
      key={item.title}
      style={styles.queueItem}
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
        <Text numberOfLines={1} style={styles.text}>
          {item.artist}
          {showDuration && (
            <>
              <IconEntypo name="dot-single" size={18} color={'white'} />
              <Text style={styles.duration}>
                {item.duration ? formatTime(item.duration) : '-- / --'}
              </Text>
            </>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
