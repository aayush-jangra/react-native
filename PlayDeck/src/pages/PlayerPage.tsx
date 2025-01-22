import React from 'react';
import {Controls} from '../components/Controls';
import {SongInfo} from '../components/SongInfo';
import {QueueList} from '../components/QueueList';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {useAppState} from '../Providers/AppProvider';

const styles = StyleSheet.create({
  queueSpace: {
    height: 64,
  },
  linearGradient: {
    flex: 1,
  },
  collapse: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export const PlayerPage = () => {
  const {setShowPlayer} = useAppState();

  return (
    <LinearGradient
      colors={['#BCFEFF', '#08BF96', '#028C65', '#00593B', '#002617']}
      style={styles.linearGradient}>
      <TouchableOpacity
        style={styles.collapse}
        onPress={() => setShowPlayer(false)}>
        <IconEntypo name="chevron-down" size={40} color="#563900" />
      </TouchableOpacity>
      <SongInfo />
      <Controls />
      <View style={styles.queueSpace} />
      <QueueList />
    </LinearGradient>
  );
};
