import {Track} from 'react-native-track-player';

export const musicQueue: Track[] = [
  {
    url: require('../assets/audio/one.mp3'),
    title: 'Song one',
    artwork:
      'https://th.bing.com/th/id/OIP.14ZwlVvJtFievUC69iEurAHaHg?rs=1&pid=ImgDetMain',
  },
  {
    url: require('../assets/audio/two.mp3'),
    title: 'Song two',
  },
  {
    url: require('../assets/audio/three.mp3'),
    title: 'Song three',
  },
  {
    url: require('../assets/audio/four.mp3'),
    title: 'Song four',
  },
];
