import React from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {useAppState} from './Providers/AppProvider';
import {PlayerPage} from './pages/PlayerPage';
import {LibraryPage} from './pages/LibraryPage';
import {MINIPLAYER_HEIGHT} from './constants/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSpace: {
    height: MINIPLAYER_HEIGHT,
  },
});

const App = () => {
  const {isPlayerSetup} = useAppState();

  if (!isPlayerSetup) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <LibraryPage />
        <View style={styles.playerSpace} />
        <PlayerPage />
      </View>
    </SafeAreaView>
  );
};

export default App;
