import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {ListItem} from './ListItem';
import {useAppState} from '../Providers/AppProvider';
import {chunkArray} from '../utils/chunkArray';
import {usePlayerState} from '../Providers/usePlayerState';

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    backgroundColor: '#004B59',
    borderRadius: 32,
    elevation: 10,
  },
  header: {
    backgroundColor: '#002226',
    height: 64,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomColor: '#5DBCFA',
    borderBottomWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heading: {
    color: '#C1DFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  songColumn: {
    width: 250,
  },
  list: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
  },
});

export const RecentSongs = () => {
  const {recentSongs} = useAppState();
  const {playNewPlaylist} = usePlayerState();

  const rowSize = 2;
  const songs = chunkArray(recentSongs, rowSize);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Recent Songs</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        horizontal
        data={songs}
        renderItem={({item, index}) => {
          const [songOne, songTwo] = item;
          return (
            <View style={styles.songColumn}>
              <ListItem
                showDuration={false}
                key={songOne.url}
                item={{
                  title: songOne.title,
                  subtitle: songOne.artist,
                  duration: songOne.duration,
                  artwork: songOne.artwork,
                }}
                onPress={() =>
                  playNewPlaylist({
                    playingFrom: 'Recent',
                    tracks: recentSongs,
                    skipIndex: index * rowSize,
                  })
                }
              />
              {songTwo && (
                <ListItem
                  showDuration={false}
                  key={songTwo.url}
                  item={{
                    title: songTwo.title,
                    subtitle: songTwo.artist,
                    duration: songTwo.duration,
                    artwork: songTwo.artwork,
                  }}
                  onPress={() =>
                    playNewPlaylist({
                      playingFrom: 'Recent',
                      tracks: recentSongs,
                      skipIndex: index * rowSize + 1,
                    })
                  }
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
