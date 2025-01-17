import App from './App';
import {AppProvider} from './Providers/AppProvider';
import React from 'react';

export const AppWithContext = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};
