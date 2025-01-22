import React from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator} from 'react-native';
import {useAppState} from './Providers/AppProvider';
// import {PlayerPage} from './pages/PlayerPage';
import {LibraryPage} from './pages/LibraryPage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
      {/* <PlayerPage /> */}
      <LibraryPage />
    </SafeAreaView>
  );
};

export default App;
