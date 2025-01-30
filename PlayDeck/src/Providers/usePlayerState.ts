import TrackPlayer, {
  AddTrack,
  RepeatMode,
  Track,
} from 'react-native-track-player';
import {StorageService} from '../services/StorageService';
import {shuffleArray} from '../utils/shuffle';
import {useAppState} from './AppProvider';
import {SavedQueueData} from '../schema/storage';
import {showSnackbar} from '../utils/showSnackbar';

export interface PlayNewPlaylistProps {
  tracks: Track[];
  playingFrom: string;
  shuffle?: boolean;
  skipIndex?: number;
}

export const usePlayerState = () => {
  const {
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
    startQueue,
    setStartQueue,
    queue,
    setQueue,
    queueName,
    setQueueName,
    playingQueueFrom,
    setPlayingQueueFrom,
  } = useAppState();
  const storage = StorageService.getInstance();

  const playNewPlaylist = async ({
    tracks,
    playingFrom,
    shuffle = false,
    skipIndex = 0,
  }: PlayNewPlaylistProps) => {
    const newPlaylist = [...tracks];
    setStartQueue([...tracks]);
    setQueueName(undefined);
    if (shuffle) {
      shuffleArray(newPlaylist);
      setIsShuffled(true);
    }
    await TrackPlayer.reset();
    await TrackPlayer.add(newPlaylist);
    await TrackPlayer.skip(skipIndex);
    setQueue(newPlaylist);
    setPlayingQueueFrom([playingFrom]);
    await TrackPlayer.play();
    storage.setPlayerData({
      playingFrom: [playingFrom],
      playingTrackIndex: skipIndex,
      startQueue: [...tracks],
      playingQueue: [...newPlaylist],
      isShuffled: shuffle,
      name: undefined,
    });
  };

  const updateSavedQueue = (queueData: Partial<SavedQueueData>) => {
    if (queueName) {
      storage.updateQueue(queueName, queueData);
    }
  };

  const playSavedQueue = async (queueData: SavedQueueData) => {
    setQueueName(queueData.name);
    setQueue(queueData.playingQueue);
    setStartQueue(queueData.startQueue);
    setIsShuffled(queueData.isShuffled);
    setRepeatMode(queueData.repeatMode);
    setPlayingQueueFrom(queueData.playingFrom);
    await TrackPlayer.reset();
    await TrackPlayer.add(queueData.playingQueue);
    await TrackPlayer.skip(queueData.playingTrackIndex);
    await TrackPlayer.play();
    storage.setPlayerData({...queueData});
  };

  const addItemInPlayingQueueFrom = (playingFrom: string) => {
    const newPlayingFrom = playingQueueFrom.some(value => value === playingFrom)
      ? [...playingQueueFrom]
      : [...playingQueueFrom, playingFrom];
    setPlayingQueueFrom(newPlayingFrom);
    storage.setPlayerData({
      playingFrom: newPlayingFrom,
    });
    updateSavedQueue({playingFrom: newPlayingFrom});
  };

  const addToQueue = async ({
    playingFrom,
    tracks,
    insertBeforeIndex,
  }: {
    playingFrom: string;
    tracks: AddTrack[];
    insertBeforeIndex?: number;
  }) => {
    await TrackPlayer.add(tracks, insertBeforeIndex);
    const newQueue = await TrackPlayer.getQueue();
    setQueue([...newQueue]);
    addItemInPlayingQueueFrom(playingFrom);
    setStartQueue([...newQueue]);
    setIsShuffled(false);
    storage.setPlayerData({
      isShuffled: false,
      playingQueue: [...newQueue],
      startQueue: [...newQueue],
    });
    updateSavedQueue({
      isShuffled: false,
      playingQueue: [...newQueue],
      startQueue: [...newQueue],
    });
  };

  const switchRepeatMode = async () => {
    let newRepeatMode = RepeatMode.Off;

    if (repeatMode === RepeatMode.Off) {
      newRepeatMode = RepeatMode.Queue;
    } else if (repeatMode === RepeatMode.Queue) {
      newRepeatMode = RepeatMode.Track;
    }

    TrackPlayer.setRepeatMode(newRepeatMode);
    storage.setPlayerData({repeatMode: newRepeatMode});
    updateSavedQueue({repeatMode: newRepeatMode});
    setRepeatMode(newRepeatMode);
  };

  const saveQueue = async (name: string) => {
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    if (
      playingQueueFrom &&
      queue &&
      startQueue &&
      currentTrackIndex !== undefined
    ) {
      storage.saveQueue({
        playingQueue: queue,
        startQueue: startQueue,
        playingFrom: playingQueueFrom,
        playingTrackIndex: currentTrackIndex,
        name,
        isShuffled,
        repeatMode: RepeatMode.Off,
      });
      setQueueName(name);
      storage.setPlayerData({name});
      showSnackbar('Queue saved');
    } else {
      showSnackbar('There was an error saving queue');
    }
  };

  return {
    playNewPlaylist,
    addItemInPlayingQueueFrom,
    playSavedQueue,
    addToQueue,
    switchRepeatMode,
    saveQueue,
    updateSavedQueue,
  };
};
