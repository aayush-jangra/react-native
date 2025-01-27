import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {formatTime, formatTimeInLetters} from '../utils/formatTime';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {ListItemMenu, ListMenuItem} from './ListItemMenu';

interface ListItemProps {
  item: {
    title?: string;
    artwork?: string;
    subtitle?: string;
    duration?: number;
  };
  onPress?: () => void;
  showDuration?: boolean;
  defaultArtwork?: 'song' | 'playlist';
  menuItems?: ListMenuItem[];
  formatDurationInLetters?: boolean;
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
  listItem: {
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

export const ListItem = ({
  item,
  showDuration = true,
  onPress,
  defaultArtwork = 'song',
  menuItems,
  formatDurationInLetters = false,
}: ListItemProps) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      {item.artwork ? (
        <Image source={{uri: item.artwork}} style={styles.artwork} />
      ) : (
        <Image
          source={
            defaultArtwork === 'song'
              ? require('../assets/images/noMusic.jpg')
              : require('../assets/images/playlist.png')
          }
          style={styles.artwork}
        />
      )}
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.text}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.text}>
          {item.subtitle}
          {showDuration && (
            <>
              <IconEntypo name="dot-single" size={18} color={'white'} />
              <Text style={styles.duration}>
                {item.duration !== undefined
                  ? formatDurationInLetters
                    ? formatTimeInLetters(item.duration)
                    : formatTime(item.duration)
                  : '-- / --'}
              </Text>
            </>
          )}
        </Text>
      </View>
      {menuItems && <ListItemMenu menuItems={menuItems} />}
    </TouchableOpacity>
  );
};
