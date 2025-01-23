import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from './App';
import {AppProvider} from './Providers/AppProvider';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

export const Main = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <AppProvider>
          <App />
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
