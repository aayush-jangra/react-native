import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from './App';
import {AppProvider} from './Providers/AppProvider';
import React from 'react';

export const Main = () => {
  return (
    <GestureHandlerRootView>
      <AppProvider>
        <App />
      </AppProvider>
    </GestureHandlerRootView>
  );
};
