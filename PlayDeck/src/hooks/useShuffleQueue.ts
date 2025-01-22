import TrackPlayer, {Track, useProgress} from 'react-native-track-player';
import {shuffleArray} from '../utils/shuffle';
import {useAppState} from '../Providers/AppProvider';

export const useShuffleQueue = () => {
  const {position} = useProgress(1000);
  const {isShuffled, setIsShuffled, startQueue, setQueue} = useAppState();

  const shuffleQueue = async () => {
    const playingPosition = position;
    const [queue, playingIndex] = await Promise.all([
      TrackPlayer.getQueue(),
      TrackPlayer.getActiveTrackIndex(),
    ]);

    console.log('====', isShuffled, startQueue);

    // Already shuffled queue, now we want to unshuffle it
    if (isShuffled && startQueue) {
      const newTrackIndex =
        playingIndex !== undefined
          ? startQueue.findIndex(
              track => track.title === queue[playingIndex].title,
            )
          : 0;

      await TrackPlayer.reset();
      await TrackPlayer.add(startQueue);
      setIsShuffled(false);
      await TrackPlayer.skip(newTrackIndex, playingPosition);
      await TrackPlayer.play();
      setQueue(startQueue);
    }
    // Shuffle the queue
    else {
      let startTrack: Track | null = null;

      if (playingIndex !== undefined) {
        startTrack = queue.splice(playingIndex, 1)[0];
      }
      shuffleArray(queue);
      if (startTrack) {
        queue.unshift(startTrack);
      }
      setIsShuffled(true);

      await TrackPlayer.setQueue(queue);
      await TrackPlayer.skip(0, playingPosition);
      setQueue(queue);
    }
  };

  return {isShuffled, shuffleQueue};
};
