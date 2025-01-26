import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

export async function requestStoragePermission() {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // For Android 13 and above
        const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO, {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to read music files.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        return result;
      } else {
        // For Android 12 and below
        const result = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message:
              'This app needs access to your storage to read music files.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return result;
      }
    }
  } catch (err) {
    console.warn(err);
  }
}
