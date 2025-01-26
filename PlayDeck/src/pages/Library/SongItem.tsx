import React, {useState} from 'react';
import {ListItem} from '../../components/ListItem';
import {Track} from 'react-native-track-player';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {useAppState} from '../../Providers/AppProvider';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomModalMenu} from '../../components/CustomModalMenu';
import {StorageService} from '../../services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../schema/routes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222625',
    padding: 12,
    borderRadius: 12,
    display: 'flex',
    gap: 16,
  },
  noPlaylistText: {
    fontSize: 24,
    color: 'white',
  },
  createNewButton: {
    height: 48,
    width: 48,
    padding: 12,
    backgroundColor: 'black',
    elevation: 10,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export const SongItem = ({
  item: song,
  index: songIndex,
  songs,
}: {
  item: Track;
  index: number;
  songs: Track[];
}) => {
  const {playNewPlaylist, loadPlaylistsFromStorage} = useAppState();
  const [showModal, setShowModal] = useState(false);
  const {navigate} = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const storage = StorageService.getInstance();
  const playlists = storage.loadPlaylists();

  const onPlaylistPress = (playlistName: string) => {
    storage.addTrackToPlaylist(playlistName, song);
    setShowModal(false);
    loadPlaylistsFromStorage();
  };

  return (
    <>
      <ListItem
        item={{
          title: song.title,
          subtitle: song.artist,
          duration: song.duration,
        }}
        onPress={() => playNewPlaylist({tracks: songs, skipIndex: songIndex})}
        menuItems={[
          {
            icon: (
              <IconMaterialCommunity
                name="playlist-plus"
                color={'white'}
                size={32}
              />
            ),
            text: 'Add to playlist',
            onPress: () => {
              setShowModal(true);
            },
          },
          {
            icon: (
              <IconMaterial name="queue-play-next" color={'white'} size={32} />
            ),
            text: 'Play next in queue',
            onPress: () => {},
          },
          {
            icon: (
              <IconMaterial name="add-to-queue" color={'white'} size={32} />
            ),
            text: 'Add to queue',
            onPress: () => {},
          },
        ]}
      />
      {showModal && (
        <CustomModalMenu
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.container}>
            {playlists && playlists.length > 0 ? (
              <FlatList
                data={playlists}
                renderItem={({item}) => {
                  return (
                    <ListItem
                      key={item.name}
                      item={{
                        title: item.name,
                        subtitle: `${item.numberOfTracks} Songs`,
                        duration: item.durationOfPlaylist,
                      }}
                      defaultArtwork="playlist"
                      onPress={() => onPlaylistPress(item.name)}
                    />
                  );
                }}
              />
            ) : (
              <Text style={styles.noPlaylistText}>No playlist available</Text>
            )}
            <TouchableOpacity
              style={styles.createNewButton}
              onPress={() => {
                setShowModal(false);
                navigate('Playlists');
              }}>
              <IconMaterialCommunity
                name="playlist-plus"
                size={24}
                color={'white'}
              />
            </TouchableOpacity>
          </View>
        </CustomModalMenu>
      )}
    </>
  );
};
