import {PERMISSIONS, request} from 'react-native-permissions';

export async function requestStoragePermission() {
  try {
    const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO, {
      title: 'Storage Permission',
      message: 'This app needs access to your storage to read music files.',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return result;
  } catch (err) {
    console.warn(err);
  }
}
