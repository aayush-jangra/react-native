import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {ListItem} from './ListItem';
import TrackPlayer, {Event} from 'react-native-track-player';
import {StorageService} from '../services/StorageService';
import {CreatePlaylistModal} from './CreateListModal';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {useAppState} from '../Providers/AppProvider';
import {getPlayingFromText} from '../utils/getPlayingFromText';
import {usePlayerState} from '../Providers/usePlayerState';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
    display: 'flex',
    gap: 8,
  },
  emptyQueue: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQueueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedItem: {
    backgroundColor: '#563900',
  },
  queueContainer: {
    paddingHorizontal: 32,
  },
  queueHeader: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 32,
  },
  playingFromText: {
    flex: 1,
    fontSize: 12,
    color: 'white',
    alignSelf: 'flex-start',
  },
  playingFromTextList: {
    fontWeight: 500,
    color: '#2CB0F2',
  },
});

export const QueueTracks = () => {
  const {queue, playingQueueFrom} = useAppState();
  const {saveQueue} = usePlayerState();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<
    number | undefined
  >();
  const [showInputModal, setShowInputModal] = useState(false);

  useEffect(() => {
    (async () => {
      const ati = await TrackPlayer.getActiveTrackIndex();
      setCurrentTrackIndex(ati);
    })();
  }, []);

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, ({index}) => {
    setCurrentTrackIndex(index);
  });

  const playFromQueue = async (index: number) => {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    setCurrentTrackIndex(index);
  };

  const existingQueues = StorageService.getInstance().loadSavedQueues() ?? [];
  const existingPlaylistNames = existingQueues.flatMap(
    playlist => playlist.name,
  );

  const onCreate = (name: string) => {
    setShowInputModal(false);
    saveQueue(name);
  };

  return (
    <>
      <View style={styles.queueHeader}>
        <Text numberOfLines={1} style={styles.playingFromText}>
          {getPlayingFromText(playingQueueFrom).startText}
          <Text style={styles.playingFromTextList}>
            {getPlayingFromText(playingQueueFrom).list}
          </Text>
        </Text>
        {queue && (
          <TouchableOpacity onPress={() => setShowInputModal(true)}>
            <IconMaterial name="save-as" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {queue ? (
        <FlatList
          style={styles.list}
          data={queue}
          renderItem={({item, index}) => {
            const currentTrack =
              currentTrackIndex !== null && currentTrackIndex === index;

            return (
              <View
                style={[
                  styles.queueContainer,
                  currentTrack ? styles.selectedItem : {},
                ]}>
                <ListItem
                  key={item.url}
                  item={{
                    title: item.title,
                    subtitle: item.artist,
                    duration: item.duration,
                    artwork: item.artwork,
                  }}
                  onPress={() => playFromQueue(index)}
                />
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.emptyQueue}>
          <IconMaterial name="music-off" size={128} color="#E82315" />
          <Text style={styles.emptyQueueText}>Nothing is playing</Text>
        </View>
      )}
      {showInputModal && (
        <CreatePlaylistModal
          type="Queue"
          visible={showInputModal}
          onClose={() => setShowInputModal(false)}
          existingNames={existingPlaylistNames}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
