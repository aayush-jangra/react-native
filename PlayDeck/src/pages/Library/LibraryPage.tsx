import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {QueueItem} from '../../components/QueueItem';
import LinearGradient from 'react-native-linear-gradient';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppState} from '../../Providers/AppProvider';
import {useLoadSongsFromStorage} from '../../hooks/useReadStorage';
import {LibraryPageFallback} from './LibraryPageFallback';

export const libraryPageStyles = StyleSheet.create({
  container: {flex: 1},
  headline: {
    color: '#222625',
    fontWeight: 'bold',
    fontSize: 72,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  list: {
    flex: 1,
    display: 'flex',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
  const {playNewPlaylist} = useAppState();
  const {isLoading, songs, error} = useLoadSongsFromStorage();

  if (isLoading) {
    return <LibraryPageFallback type="loading" />;
  }

  if (error && error.type === 'Permission') {
    return <LibraryPageFallback type="errorPermission" />;
  }

  if (error || !songs) {
    return <LibraryPageFallback type="errorReading" />;
  }

  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={libraryPageStyles.container}>
      <Text style={libraryPageStyles.headline}>Songs</Text>
      <View style={libraryPageStyles.controlsContainer}>
        <TouchableOpacity
          style={libraryPageStyles.iconButton}
          onPress={() => playNewPlaylist({tracks: songs})}>
          <IconEntypo
            name="controller-play"
            size={48}
            color="#6BE048"
            style={libraryPageStyles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={libraryPageStyles.iconButton}
          onPress={() => playNewPlaylist({tracks: songs, shuffle: true})}>
          <IconMaterialCommunity
            name="shuffle-variant"
            size={36}
            color="#6BE048"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        style={libraryPageStyles.list}
        data={songs}
        renderItem={({item, index}) => {
          return (
            <QueueItem
              key={item.title}
              item={item}
              onPress={() => playNewPlaylist({tracks: songs, skipIndex: index})}
            />
          );
        }}
      />
    </LinearGradient>
  );
};
