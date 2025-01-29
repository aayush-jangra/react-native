import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppState} from '../../Providers/AppProvider';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PlaylistStackParamList} from '../../schema/routes';
import {SongItem} from '../Library/SongItem';
import {formatTimeInLetters} from '../../utils/formatTime';
import {Track} from 'react-native-track-player';
import {StorageService} from '../../services/StorageService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    display: 'flex',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  iconButton: {
    borderRadius: 16,
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#260012',
    marginVertical: 16,
    elevation: 10,
  },
  icon: {
    paddingLeft: 6,
  },
  artwork: {
    height: '80%',
    width: 'auto',
    aspectRatio: 1,
    borderRadius: 16,
    elevation: 10,
    maxHeight: 180,
  },
  playlistInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginVertical: 16,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFFF2',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    color: '#18F2CE',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

type SinglePlaylistProps = NativeStackScreenProps<
  PlaylistStackParamList,
  'SinglePlaylist'
>;

export const SinglePlaylist = ({route}: SinglePlaylistProps) => {
  const {name, durationOfPlaylist, tracks, numberOfTracks} = route.params;
  const [duration, setDuration] = useState(durationOfPlaylist);
  const [trackCount, setTrackCount] = useState(numberOfTracks);
  const [songs, setSongs] = useState([...tracks]);

  const {playNewPlaylist, loadPlaylistsFromStorage} = useAppState();

  const removeTrack = (track: Track) => {
    StorageService.getInstance().removeTrackFromPlaylist(name, track);
    setDuration(prev => prev - (track.duration || 0));
    setTrackCount(prev => prev - 1);
    setSongs(prev => [...prev.filter(item => item.url !== track.url)]);
    loadPlaylistsFromStorage();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.playlistInfo}>
          <Image
            source={require('../../assets/images/playlist.png')}
            style={styles.artwork}
          />
          <Text numberOfLines={1} style={styles.playlistName}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.text}>
            {trackCount === 1 ? `${trackCount} song` : `${trackCount} songs`}
            <IconEntypo name="dot-single" size={16} color={'white'} />
            <Text style={styles.duration}>{formatTimeInLetters(duration)}</Text>
          </Text>
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => playNewPlaylist({playingFrom: name, tracks: songs})}>
            <IconEntypo
              name="controller-play"
              size={48}
              color="#6BE048"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              playNewPlaylist({playingFrom: name, tracks: songs, shuffle: true})
            }>
            <IconMaterialCommunity
              name="shuffle-variant"
              size={36}
              color="#6BE048"
            />
          </TouchableOpacity>
        </View>
        <FlatList
          scrollEnabled={false}
          style={styles.list}
          data={songs}
          renderItem={({item, index}) => (
            <SongItem
              playingFrom={name}
              key={item.url}
              item={item}
              onPress={() =>
                playNewPlaylist({
                  playingFrom: name,
                  tracks: songs,
                  skipIndex: index,
                })
              }
              additionalMenuItems={[
                {
                  text: 'Remove from playlist',
                  icon: (
                    <IconMaterialCommunity
                      name="playlist-minus"
                      color={'white'}
                      size={32}
                    />
                  ),
                  onPress: () => removeTrack(item),
                },
              ]}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};
