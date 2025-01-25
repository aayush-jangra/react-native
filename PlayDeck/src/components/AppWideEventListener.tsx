import React, {useRef} from 'react';
import TrackPlayer, {Event, Track} from 'react-native-track-player';
import {StorageService} from '../services/StorageService';
import {useAppState} from '../Providers/AppProvider';
import {updateRecentSongs} from '../utils/updateRecentSongs';

export const AppWideEventListener = () => {
  const {setRecentSongs} = useAppState();
  const lastUpdatedTrack = useRef<Track | null>(null);

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, ({track}) => {
    if (
      track &&
      (!lastUpdatedTrack.current || lastUpdatedTrack.current.url !== track.url)
    ) {
      lastUpdatedTrack.current = track;

      setTimeout(() => {
        TrackPlayer.getActiveTrack().then(activeTrack => {
          if (
            activeTrack &&
            activeTrack.url === lastUpdatedTrack.current?.url
          ) {
            setRecentSongs(prev => {
              const updatedList = updateRecentSongs([...prev], activeTrack);
              StorageService.getInstance().setRecentSongs(updatedList);
              return updatedList;
            });
          }
        });
      }, 5000);
    }
  });

  return <></>;
};
