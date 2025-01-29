import Snackbar from 'react-native-snackbar';

export const showSnackbar = (text: string) => {
  // Issue with react-native-snackbar requires a setTimeout
  // https://www.npmjs.com/package/react-native-snackbar#troubleshooting
  setTimeout(() => {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'white',
      textColor: 'black',
      marginBottom: 96,
    });
  }, 1000);
};
