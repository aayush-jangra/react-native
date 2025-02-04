import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLoadSongsFromStorage} from '../../hooks/useReadStorage';
import {LibraryPageFallback} from './LibraryPageFallback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {SongItem} from './SongItem';
import {SortButton} from './SortButton';
import {StorageService} from '../../services/StorageService';
import {SortOptions} from './sortOptions';
import {usePlayerState} from '../../Providers/usePlayerState';
import {TextInput} from 'react-native-gesture-handler';
import {Track} from 'react-native-track-player';
import {debounce} from '../../utils/debounce';

const ABSOLUTE_BUTTON_WIDTH = 96;
const ABSOLUTE_BUTTON_TRANSLATE_BUFFER = 96;

export const libraryPageStyles = StyleSheet.create({
  container: {flex: 1},
  headline: {
    color: '#222625',
    fontWeight: 'bold',
    fontSize: 72,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  list: {
    flex: 1,
    display: 'flex',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
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
  iconButtonAbsolute: {
    borderRadius: 32,
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6BE048',
    elevation: 10,
  },
  absolutePlay: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    width: ABSOLUTE_BUTTON_WIDTH,
    borderWidth: 2,
    borderColor: '#6BE048',
    borderLeftWidth: 0,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 4,
    borderTopRightRadius: 48,
    borderBottomRightRadius: 48,
  },
  absoluteShuffle: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    width: ABSOLUTE_BUTTON_WIDTH,
    borderWidth: 2,
    borderColor: '#6BE048',
    borderRightWidth: 0,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'flex-start',
    padding: 4,
    borderTopLeftRadius: 48,
    borderBottomLeftRadius: 48,
  },
  filters: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#00000080',
    flex: 1,
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});

export const LibraryPage = () => {
  const {playNewPlaylist} = usePlayerState();
  const storageSort = StorageService.getInstance().loadSortPreference();

  const defaultSortOption: SortOptions = storageSort || 'a2z';

  const [searchInput, setSearchInput] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Track[] | null>(null);
  const [sortOption, setSortOption] = useState<SortOptions>(defaultSortOption);
  const {isLoading, songs, error} = useLoadSongsFromStorage(sortOption);
  const scrollOffset = useSharedValue(0);
  const {width: windowWidth} = Dimensions.get('window');

  const animatedStylesPlayStatic = useAnimatedStyle(() => ({
    transform: [
      {translateX: Math.max(-scrollOffset.value, -(windowWidth / 2))},
    ],
  }));

  const animatedStylesShuffleStatic = useAnimatedStyle(() => ({
    transform: [{translateX: Math.min(scrollOffset.value, windowWidth / 2)}],
  }));

  const animatedStylesPlayAbsolute = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: Math.min(
          scrollOffset.value -
            (ABSOLUTE_BUTTON_WIDTH + ABSOLUTE_BUTTON_TRANSLATE_BUFFER),
          0,
        ),
      },
    ],
  }));

  const animatedStylesShuffleAbsolute = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: Math.max(
          ABSOLUTE_BUTTON_WIDTH +
            ABSOLUTE_BUTTON_TRANSLATE_BUFFER -
            scrollOffset.value,
          0,
        ),
      },
    ],
  }));

  const filterDebounce = useMemo(
    () =>
      debounce(
        ({allSongs, searchString}: {allSongs: any[]; searchString: string}) => {
          setFilteredSongs(
            allSongs.filter(song =>
              song.title?.toLowerCase().includes(searchString.toLowerCase()),
            ),
          );
        },
      ),
    [],
  );

  if (isLoading) {
    return <LibraryPageFallback type="loading" />;
  }

  if (error && error.type === 'Permission') {
    return <LibraryPageFallback type="errorPermission" />;
  }

  if (error || !songs) {
    return <LibraryPageFallback type="errorReading" />;
  }

  const onSortingChange = (sortPref: SortOptions) => {
    setSortOption(sortPref);
    StorageService.getInstance().setSortPreference(sortPref);
  };

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);
    if (text) {
      filterDebounce({allSongs: songs, searchString: text});
    } else {
      setFilteredSongs(null);
    }
  };

  const handleSongClick = (url: string) => {
    const index = songs.findIndex(song => song.url === url);

    playNewPlaylist({
      playingFrom: 'Library',
      tracks: songs,
      skipIndex: index === -1 ? 0 : index,
    });
  };

  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={libraryPageStyles.container}>
      <Text style={libraryPageStyles.headline}>Songs</Text>
      <ScrollView
        onScroll={event => {
          scrollOffset.value = event.nativeEvent.contentOffset.y;
        }}>
        <View style={libraryPageStyles.controlsContainer}>
          <Animated.View style={animatedStylesPlayStatic}>
            <TouchableOpacity
              style={libraryPageStyles.iconButton}
              onPress={() =>
                playNewPlaylist({playingFrom: 'Library', tracks: songs})
              }>
              <IconEntypo
                name="controller-play"
                size={48}
                color="#6BE048"
                style={libraryPageStyles.icon}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={animatedStylesShuffleStatic}>
            <TouchableOpacity
              style={libraryPageStyles.iconButton}
              onPress={() =>
                playNewPlaylist({
                  playingFrom: 'Library',
                  tracks: songs,
                  shuffle: true,
                })
              }>
              <IconMaterialCommunity
                name="shuffle-variant"
                size={36}
                color="#6BE048"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={libraryPageStyles.filters}>
          <View style={libraryPageStyles.searchInput}>
            <TextInput
              value={searchInput}
              style={libraryPageStyles.container}
              placeholder="Search"
              onChangeText={handleSearchInputChange}
            />
            {searchInput && (
              <IconEntypo
                onPress={() => handleSearchInputChange('')}
                name="circle-with-cross"
                size={24}
                color="white"
              />
            )}
          </View>
          <SortButton
            sortPreference={sortOption}
            onSortingChange={onSortingChange}
          />
        </View>
        <FlatList
          scrollEnabled={false}
          style={libraryPageStyles.list}
          data={filteredSongs ?? songs}
          renderItem={({item}) => (
            <SongItem
              playingFrom="Library"
              key={item.url}
              item={item}
              onPress={() => handleSongClick(item.url)}
            />
          )}
        />
        <View style={{height: ABSOLUTE_BUTTON_WIDTH}}>{}</View>
      </ScrollView>
      <Animated.View
        style={[libraryPageStyles.absolutePlay, animatedStylesPlayAbsolute]}>
        <TouchableOpacity
          style={libraryPageStyles.iconButtonAbsolute}
          onPress={() =>
            playNewPlaylist({playingFrom: 'Library', tracks: songs})
          }>
          <IconEntypo
            name="controller-play"
            size={48}
            color="#260012"
            style={libraryPageStyles.icon}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          libraryPageStyles.absoluteShuffle,
          animatedStylesShuffleAbsolute,
        ]}>
        <TouchableOpacity
          style={libraryPageStyles.iconButtonAbsolute}
          onPress={() =>
            playNewPlaylist({
              playingFrom: 'Library',
              tracks: songs,
              shuffle: true,
            })
          }>
          <IconMaterialCommunity
            name="shuffle-variant"
            size={36}
            color="#260012"
          />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};
