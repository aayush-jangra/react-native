import React from 'react';
import {SafeAreaView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Controls} from './components/Controls';
import {SongInfo} from './components/SongInfo';
import {QueueList} from './components/QueueList';
import LinearGradient from 'react-native-linear-gradient';
import {useAppState} from './Providers/AppProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    padding: 4,
  },
  queueSpace: {
    height: 64,
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
      <LinearGradient
        colors={['#BCFEFF', '#08BF96', '#028C65', '#00593B', '#002617']}
        style={styles.linearGradient}>
        <SongInfo />
        <Controls />
        <View style={styles.queueSpace} />
      </LinearGradient>
      <QueueList />
    </SafeAreaView>
  );
};

export default App;
