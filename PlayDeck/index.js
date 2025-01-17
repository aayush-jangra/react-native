import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {name as appName} from './app.json';
import {PlaybackService} from './src/services/PlaybackService';
import {AppWithContext} from './src/AppWithProvider';

AppRegistry.registerComponent(appName, () => AppWithContext);
TrackPlayer.registerPlaybackService(() => PlaybackService);
