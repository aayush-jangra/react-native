import React from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {PlayerPage} from '../pages/PlayerPage';
import {MINIPLAYER_HEIGHT} from '../constants/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSpace: {
    height: MINIPLAYER_HEIGHT,
  },
});

export const RenderPageWithPlayer = ({
  page,
  style,
}: {
  page: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={style}>
        {page}
        <View style={styles.playerSpace} />
        <PlayerPage />
      </View>
    </SafeAreaView>
  );
};
