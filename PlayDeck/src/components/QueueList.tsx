import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import TrackPlayer, {Track} from 'react-native-track-player';
import {formatTime} from '../utils/formatTime';

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
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 12,
    gap: 16,
    height: '100%',
  },
  loading: {
    height: '100%',
    width: '100%',
  },
  queueItem: {
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 4,
  },
  selectedItem: {
    borderColor: 'green',
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  list: {
    flex: 1,
    width: '100%',
    display: 'flex',
    gap: 8,
  },
});

export const QueueList = () => {
  const [queue, setQueue] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const trackQueue = await TrackPlayer.getQueue();
      setQueue(trackQueue);

      const trackIndex = await TrackPlayer.getActiveTrackIndex();
      trackIndex !== undefined && setCurrentTrackIndex(trackIndex);
    })();
  }, []);

  if (!queue) {
    return <ActivityIndicator style={styles.loading} size={96} />;
  }

  const playFromQueue = async (index: number) => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    setCurrentTrackIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={queue}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.queueItem,
                currentTrackIndex !== null && currentTrackIndex === index
                  ? styles.selectedItem
                  : {},
              ]}
              onPress={() => playFromQueue(index)}>
              {item.artwork && (
                <Image source={{uri: item.artwork}} height={16} width={16} />
              )}
              <Text style={styles.text}>{item.title}</Text>
              <Text style={styles.duration}>
                {item.duration ? formatTime(item.duration) : '-- / --'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
