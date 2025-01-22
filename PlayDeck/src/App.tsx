import React from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {useAppState} from './Providers/AppProvider';
import {PlayerPage} from './pages/PlayerPage';
import {LibraryPage} from './pages/LibraryPage';
import {MiniPlayer} from './components/MiniPlayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => {
  const {isPlayerSetup, showPlayer} = useAppState();

  if (!isPlayerSetup) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {showPlayer ? (
        <PlayerPage />
      ) : (
        <View style={styles.container}>
          <LibraryPage />
          <MiniPlayer />
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
