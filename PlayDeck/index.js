import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {name as appName} from './app.json';
import {PlaybackService} from './src/services/PlaybackService';
import {Main} from './src/main';

AppRegistry.registerComponent(appName, () => Main);
TrackPlayer.registerPlaybackService(() => PlaybackService);
