import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {libraryPageStyles} from './LibraryPage';
import {openSettings} from 'react-native-permissions';

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  error: {
    flex: 1,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  errorText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  errorButton: {
    padding: 24,
    backgroundColor: 'black',
    elevation: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export const LibraryPageFallback = ({
  type,
}: {
  type: 'loading' | 'errorPermission' | 'errorReading';
}) => {
  return (
    <LinearGradient
      colors={['#FFF2F2', '#FB818F', '#DE1241', '#260012']}
      locations={[0.1, 0.2, 0.5, 1]}
      style={libraryPageStyles.container}>
      <Text style={libraryPageStyles.headline}>Songs</Text>
      <View style={libraryPageStyles.controlsContainer}>
        <TouchableOpacity
          style={[libraryPageStyles.iconButton, styles.disabled]}
          disabled>
          <IconEntypo
            name="controller-play"
            size={48}
            color="#6BE048"
            style={libraryPageStyles.icon}
            disabled
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[libraryPageStyles.iconButton, styles.disabled]}
          disabled>
          <IconMaterialCommunity
            name="shuffle-variant"
            size={36}
            color="#6BE048"
            disabled
          />
        </TouchableOpacity>
      </View>
      {type === 'loading' && (
        <ActivityIndicator size={96} style={libraryPageStyles.list} />
      )}
      {type === 'errorPermission' && (
        <View style={styles.error}>
          <Text style={styles.errorText}>
            App needs storage permission to load songs
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              openSettings();
            }}>
            <Text style={styles.permissionText}>Give Permission</Text>
          </TouchableOpacity>
        </View>
      )}
      {type === 'errorReading' && (
        <View style={styles.error}>
          <Text style={styles.errorText}>There was an error loading songs</Text>
        </View>
      )}
    </LinearGradient>
  );
};
