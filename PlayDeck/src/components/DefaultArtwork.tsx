import React from 'react';
import {StyleSheet, View} from 'react-native';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  largeArtwork: {
    height: 'auto',
    width: '80%',
    aspectRatio: 1,
    borderRadius: 16,
    elevation: 10,
    backgroundColor: '#002617',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallArtwork: {
    height: 48,
    width: 48,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#BCFEFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const DefaultArtwork = ({
  size = 'large',
}: {
  size?: 'small' | 'large';
}) => {
  return (
    <View style={size === 'large' ? styles.largeArtwork : styles.smallArtwork}>
      <IconMaterialCommunity
        name="music-clef-treble"
        size={size === 'large' ? 96 : 32}
        color={size === 'large' ? '#85FDF7' : '#00593B'}
      />
    </View>
  );
};
