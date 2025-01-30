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
import {usePlayerState} from '../Providers/usePlayerState';
import {ConfirmationModal} from './ConfrimationModal';

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
  const {queueName} = useAppState();
  const {playSavedQueue} = usePlayerState();
  const storageQueues = StorageService.getInstance().loadSavedQueues();
  const [savedQueues, setSavedQueues] = useState(storageQueues ?? []);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const deleteQueue = () => {
    if (selectedQueue) {
      setSavedQueues(prev => prev.filter(item => item.name !== selectedQueue));
      StorageService.getInstance().deleteQueue(selectedQueue);
      showSnackbar('Queue removed');
    }
  };

  const playQueue = async (queueData: SavedQueueData) => {
    playSavedQueue(queueData);
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
              <TouchableOpacity
                onPress={() => {
                  setSelectedQueue(item.name);
                  setShowConfirmationModal(true);
                }}>
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
      {showConfirmationModal && (
        <ConfirmationModal
          confirmationText="Delete queue?"
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={deleteQueue}
        />
      )}
    </View>
  );
};
