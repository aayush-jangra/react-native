import React, {useState} from 'react';
import {ListItem} from '../../components/ListItem';
import TrackPlayer, {Track} from 'react-native-track-player';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {useAppState} from '../../Providers/AppProvider';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomModalMenu} from '../../components/CustomModalMenu';
import {StorageService} from '../../services/StorageService';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../schema/routes';
import {ListMenuItem} from '../../components/ListItemMenu';
import {showSnackbar} from '../../utils/showSnackbar';

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
  playingFrom,
  item: song,
  additionalMenuItems,
  onPress,
}: {
  playingFrom: string;
  item: Track;
  additionalMenuItems?: ListMenuItem[];
  onPress: () => void;
}) => {
  const {
    loadPlaylistsFromStorage,
    setQueue,
    setIsShuffled,
    setStartQueue,
    addItemInPlayingQueueFrom,
  } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const {navigate} = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const storage = StorageService.getInstance();
  const playlists = storage.loadPlaylists();

  const onPlaylistPress = (playlistName: string) => {
    storage.addTrackToPlaylist(playlistName, song);
    setShowModal(false);
    loadPlaylistsFromStorage();

    showSnackbar('Added song to ' + playlistName);
  };

  const addToQueue = async (insertBeforeIndex?: number) => {
    await TrackPlayer.add(song, insertBeforeIndex);
    const newQueue = await TrackPlayer.getQueue();
    setQueue([...newQueue]);
    addItemInPlayingQueueFrom(playingFrom);
    setStartQueue([...newQueue]);
    setIsShuffled(false);
    StorageService.getInstance().setPlayerData({
      isShuffled: false,
      playingQueue: [...newQueue],
      startQueue: [...newQueue],
    });
  };

  const playLastInQueue = async () => {
    await addToQueue();
    showSnackbar('Added song to queue');
  };

  const playNextInQueue = async () => {
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex !== undefined) {
      addToQueue(currentIndex + 1);
      showSnackbar('Song will play next');
    } else {
      showSnackbar('Could not add song');
    }
  };

  const defaultMenuItems: ListMenuItem[] = [
    {
      icon: (
        <IconMaterialCommunity name="playlist-plus" color={'white'} size={32} />
      ),
      text: 'Add to playlist',
      onPress: () => {
        setShowModal(true);
      },
    },
    {
      icon: <IconMaterial name="queue-play-next" color={'white'} size={32} />,
      text: 'Play next in queue',
      onPress: playNextInQueue,
    },
    {
      icon: <IconMaterial name="add-to-queue" color={'white'} size={32} />,
      text: 'Add to queue',
      onPress: playLastInQueue,
    },
  ];

  const menuItems = additionalMenuItems
    ? [...defaultMenuItems, ...additionalMenuItems]
    : defaultMenuItems;

  return (
    <>
      <ListItem
        item={{
          title: song.title,
          subtitle: song.artist,
          duration: song.duration,
          artwork: song.artwork,
        }}
        onPress={onPress}
        menuItems={menuItems}
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
