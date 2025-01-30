import React, {useState} from 'react';
import {StorageService} from '../services/StorageService';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {getPlayingFromText} from '../utils/getPlayingFromText';
import {showSnackbar} from '../utils/showSnackbar';
import {SavedQueueData} from '../schema/storage';
import {useAppState} from '../Providers/AppProvider';
import TrackPlayer from 'react-native-track-player';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  emptyList: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  queue: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 32,
  },
  queueName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  queueSubtitle: {
    fontSize: 12,
    color: 'white',
    fontStyle: 'italic',
  },
  playingFromTextList: {
    fontWeight: 500,
    color: '#2CB0F2',
  },
  artwork: {
    backgroundColor: '#85FDF7',
    height: 48,
    width: 48,
    aspectRatio: 1,
    borderRadius: 12,
  },
  queueDetails: {
    flex: 1,
  },
  selectedItem: {
    backgroundColor: '#563900',
  },
});

export const SavedQueues = ({showTracks}: {showTracks: () => void}) => {
  const {
    queueName,
    setQueueName,
    setQueue,
    setStartQueue,
    setIsShuffled,
    setPlayingQueueFrom,
  } = useAppState();
  const storageQueues = StorageService.getInstance().loadSavedQueues();
  const [savedQueues, setSavedQueues] = useState(storageQueues ?? []);

  const deleteQueue = (name: string) => {
    setSavedQueues(prev => prev.filter(item => item.name !== name));
    StorageService.getInstance().deleteQueue(name);
    showSnackbar('Queue removed');
  };

  const playQueue = async (queueData: SavedQueueData) => {
    setQueueName(queueData.name);
    setQueue(queueData.playingQueue);
    setStartQueue(queueData.startQueue);
    setIsShuffled(queueData.isShuffled);
    setPlayingQueueFrom(queueData.playingFrom);
    await TrackPlayer.reset();
    await TrackPlayer.add(queueData.playingQueue);
    await TrackPlayer.skip(queueData.playingTrackIndex);
    await TrackPlayer.play();
    StorageService.getInstance().setPlayerData({...queueData});
    showTracks();
  };

  return (
    <View style={styles.container}>
      {savedQueues && savedQueues.length ? (
        <FlatList
          data={savedQueues}
          renderItem={({item}) => (
            <View
              key={item.name}
              style={[
                styles.queue,
                queueName === item.name ? styles.selectedItem : {},
              ]}>
              <Image
                source={require('../assets/images/queue.png')}
                style={styles.artwork}
              />
              <View style={styles.queueDetails}>
                <Text style={styles.queueName}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.queueSubtitle}>
                  {item.playingQueue.length} songs
                  <IconEntypo name="dot-single" size={12} color={'white'} />
                  {getPlayingFromText(item.playingFrom).startText}
                  <Text style={styles.playingFromTextList}>
                    {getPlayingFromText(item.playingFrom).list}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteQueue(item.name)}>
                <IconMaterialCommunity
                  name="delete"
                  size={26}
                  color="#E6C72E"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => playQueue(item)}>
                <IconEntypo name="controller-play" size={32} color="#E6C72E" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyList}>
          <Text style={styles.emptyListText}>No saved queue</Text>
        </View>
      )}
    </View>
  );
};
