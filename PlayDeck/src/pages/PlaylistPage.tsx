import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {PlaylistData} from '../schema/storage';
import {CreatePlaylistModal} from '../components/CreatePlaylistModal';
import {ListItem} from '../components/ListItem';

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
});

export const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [showModal, setShowModal] = useState(false);

  const existingPlaylistNames = playlists.flatMap(playlist => playlist.name);

  const onCreate = (name: string) => {
    setPlaylists(prev => [
      ...prev,
      {name, tracks: [], numberOfTracks: 0, durationOfPlaylist: 0},
    ]);
    setShowModal(false);
  };

  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={styles.container}>
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
                      subtitle: `${item.numberOfTracks} Songs`,
                      duration: item.durationOfPlaylist,
                    }}
                    defaultArtwork="playlist"
                  />
                );
              }}
            />
            {!showModal && (
              <TouchableOpacity
                onPress={() => setShowModal(true)}
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
              onPress={() => setShowModal(true)}
              style={styles.createNewButton}>
              <Text style={styles.buttonText}>Create new</Text>
              <IconMaterialCommunity
                name="playlist-plus"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        {showModal && (
          <CreatePlaylistModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            existingPlaylistNames={existingPlaylistNames}
            onCreate={onCreate}
          />
        )}
      </View>
    </LinearGradient>
  );
};
