import React from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RecentSongs} from '../components/RecentSongs';
import {FavouriteSongs} from '../components/FavouriteSongs';

const styles = StyleSheet.create({
  container: {flex: 1, display: 'flex'},
  headline: {
    color: '#222625',
    fontWeight: 'bold',
    fontSize: 72,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  sections: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
});

export const HomePage = () => {
  const sections = [
    {key: 'RecentSongs', Component: <RecentSongs />},
    {
      key: 'FavouriteSongs',
      Component: <FavouriteSongs />,
    },
    {key: 'RecentSongs2', Component: <RecentSongs />},
  ];

  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={styles.container}>
      <Text style={styles.headline}>Play Deck</Text>
      <FlatList
        contentContainerStyle={styles.sections}
        data={sections}
        keyExtractor={item => item.key}
        renderItem={({item}) => item.Component}
      />
    </LinearGradient>
  );
};
