import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {CreatePlaylistModal} from '../../components/CreateListModal';
import {ListItem} from '../../components/ListItem';
import {StorageService} from '../../services/StorageService';
import {useAppState} from '../../Providers/AppProvider';
import {useNavigation} from '@react-navigation/native';
import {PlaylistStackParamList} from '../../schema/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showSnackbar} from '../../utils/showSnackbar';
import TrackPlayer from 'react-native-track-player';
import {CustomModalMenu} from '../../components/CustomModalMenu';
import {PlaylistData} from '../../schema/storage';
import {usePlayerState} from '../../Providers/usePlayerState';
import {ConfirmationModal} from '../../components/ConfrimationModal';

const styles = StyleSheet.create({
  container: {flex: 1, display: 'flex'},
  headline: {
    color: '#222625',
    fontWeight: 'bold',
    fontSize: 72,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createNewButton: {
    padding: 24,
    backgroundColor: 'black',
    elevation: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexShrink: 1,
    alignSelf: 'center',
  },
  createNewButtonAbsolute: {
    height: 64,
    width: 64,
    padding: 12,
    backgroundColor: 'black',
    elevation: 10,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  buttonText: {
    fontSize: 32,
    color: 'white',
  },
  buttonIcon: {
    marginBottom: -8,
    fontSize: 32,
    color: 'white',
  },
  playlistContainer: {
    padding: 24,
    flex: 1,
  },
  noPlaylistText: {
    fontSize: 24,
    color: 'white',
  },
  playlistsModalContainer: {
    backgroundColor: '#222625',
    padding: 12,
    borderRadius: 12,
    display: 'flex',
    gap: 16,
  },
  playlistModalCreateButton: {
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

export const AllPlaylists = () => {
  const {playlists, setPlaylists, loadPlaylistsFromStorage} = useAppState();
  const {addToQueue} = usePlayerState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(
    null,
  );
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<PlaylistStackParamList>>();
  const storage = StorageService.getInstance();

  const existingPlaylistNames = playlists.flatMap(playlist => playlist.name);

  const onCreate = (name: string) => {
    storage.addPlaylist({
      name,
      tracks: [],
      numberOfTracks: 0,
      durationOfPlaylist: 0,
    });
    setPlaylists(prev => [
      ...prev,
      {name, tracks: [], numberOfTracks: 0, durationOfPlaylist: 0},
    ]);
    setShowCreateModal(false);
  };

  const playLastInQueue = async (playlist: PlaylistData) => {
    await addToQueue({tracks: playlist.tracks, playingFrom: playlist.name});
    showSnackbar('Added playlist to queue');
  };

  const playNextInQueue = async (playlist: PlaylistData) => {
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex !== undefined) {
      await addToQueue({
        tracks: playlist.tracks,
        playingFrom: playlist.name,
        insertBeforeIndex: currentIndex + 1,
      });
      showSnackbar('Playlist will play next');
    } else {
      showSnackbar('Could not add playlist');
    }
  };

  const deletePlaylist = () => {
    if (selectedPlaylist) {
      storage.deletePlaylist(selectedPlaylist.name);
      setPlaylists(prev =>
        prev.filter(({name}) => name !== selectedPlaylist.name),
      );

      showSnackbar('Deleted playlist ' + selectedPlaylist.name);
    }
  };

  const onPlaylistPress = (playlistName: string) => {
    if (selectedPlaylist) {
      storage.addTracksToPlaylist(
        playlistName,
        selectedPlaylist.tracks,
        selectedPlaylist.durationOfPlaylist,
      );
      setShowPlaylistsModal(false);
      loadPlaylistsFromStorage();

      showSnackbar('Added songs to ' + playlistName);
    } else {
      showSnackbar('There was an error adding songs');
    }
  };

  return (
    <>
      <Text style={styles.headline}>Playlists</Text>
      <View style={styles.playlistContainer}>
        {playlists.length > 0 ? (
          <>
            <FlatList
              data={playlists}
              renderItem={({item}) => {
                return (
                  <ListItem
                    key={item.name}
                    item={{
                      title: item.name,
                      subtitle: `${
                        item.numberOfTracks === 1
                          ? `${item.numberOfTracks} song`
                          : `${item.numberOfTracks} songs`
                      }`,
                      duration: item.durationOfPlaylist,
                    }}
                    defaultArtwork="playlist"
                    onPress={() => navigate('SinglePlaylist', {...item})}
                    formatDurationInLetters
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
                          setSelectedPlaylist({...item});
                          setShowPlaylistsModal(true);
                        },
                      },
                      {
                        icon: (
                          <IconMaterial
                            name="queue-play-next"
                            color={'white'}
                            size={32}
                          />
                        ),
                        text: 'Play next in queue',
                        onPress: () => playNextInQueue(item),
                      },
                      {
                        icon: (
                          <IconMaterial
                            name="add-to-queue"
                            color={'white'}
                            size={32}
                          />
                        ),
                        text: 'Add to queue',
                        onPress: () => playLastInQueue(item),
                      },
                      {
                        text: 'Delete playlist',
                        icon: (
                          <IconMaterialCommunity
                            name="playlist-remove"
                            color={'white'}
                            size={32}
                          />
                        ),
                        onPress: () => {
                          setSelectedPlaylist({...item});
                          setShowDeleteModal(true);
                        },
                      },
                    ]}
                  />
                );
              }}
            />
            {!showCreateModal && (
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                style={styles.createNewButtonAbsolute}>
                <IconMaterialCommunity
                  name="playlist-plus"
                  size={32}
                  color={'white'}
                />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              style={styles.createNewButton}>
              <Text style={styles.buttonText}>Create new</Text>
              <IconMaterialCommunity
                name="playlist-plus"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        {showCreateModal && (
          <CreatePlaylistModal
            type="Playlist"
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            existingNames={existingPlaylistNames}
            onCreate={onCreate}
          />
        )}
        {showDeleteModal && (
          <ConfirmationModal
            confirmationText="Delete playlist?"
            visible
            onClose={() => setShowDeleteModal(false)}
            onConfirm={deletePlaylist}
          />
        )}
        {showPlaylistsModal && (
          <CustomModalMenu
            visible={showPlaylistsModal}
            onRequestClose={() => setShowPlaylistsModal(false)}>
            <View style={styles.playlistsModalContainer}>
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
                style={styles.playlistModalCreateButton}
                onPress={() => {
                  setShowPlaylistsModal(false);
                  setShowCreateModal(true);
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
      </View>
    </>
  );
};
