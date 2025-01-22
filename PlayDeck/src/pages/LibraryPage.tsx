import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {musicQueue} from '../constants/musicQueue';
import {QueueItem} from '../components/QueueItem';
import LinearGradient from 'react-native-linear-gradient';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer from 'react-native-track-player';
import {shuffleArray} from '../utils/shuffle';

const styles = StyleSheet.create({
  container: {flex: 1},
  headline: {
    color: '#3A8313',
    fontWeight: 'bold',
    fontSize: 72,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  list: {
    flex: 1,
    display: 'flex',
    gap: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingVertical: 20,
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  iconButton: {
    borderRadius: 48,
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#260012',
    marginVertical: 16,
    elevation: 10,
  },
  icon: {
    paddingLeft: 6,
  },
});

export const LibraryPage = () => {
  const playAllSongs = async () => {
    await TrackPlayer.reset();
    await TrackPlayer.add(musicQueue);
    await TrackPlayer.play();
  };

  const shuffleAllSongs = async () => {
    const allSongs = [...musicQueue];
    shuffleArray(allSongs);
    await TrackPlayer.reset();
    await TrackPlayer.add(allSongs);
    await TrackPlayer.play();
  };

  const playSongByIndex = async (index: number) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(musicQueue);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={styles.container}>
      <Text style={styles.headline}>Songs</Text>
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={playAllSongs}>
          <IconEntypo
            name="controller-play"
            size={48}
            color="#6BE048"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={shuffleAllSongs}>
          <IconMaterialCommunity
            name="shuffle-variant"
            size={36}
            color="#6BE048"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={musicQueue}
        renderItem={({item, index}) => {
          return (
            <QueueItem
              key={item.title}
              item={item}
              onPress={() => playSongByIndex(index)}
            />
          );
        }}
      />
    </LinearGradient>
  );
};
