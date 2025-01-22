import React from 'react';
import {Controls} from '../components/Controls';
import {SongInfo} from '../components/SongInfo';
import {QueueList} from '../components/QueueList';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  queueSpace: {
    height: 64,
  },
  linearGradient: {
    flex: 1,
  },
});

export const PlayerPage = () => {
  return (
    <LinearGradient
      colors={['#BCFEFF', '#08BF96', '#028C65', '#00593B', '#002617']}
      style={styles.linearGradient}>
      <SongInfo />
      <Controls />
      <View style={styles.queueSpace} />
      <QueueList />
    </LinearGradient>
  );
};
