import React from 'react';
import {SafeAreaView, ActivityIndicator, StatusBar} from 'react-native';
import {useAppState} from './Providers/AppProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from './schema/routes';
import {HomePageDetails, LibraryPageDetails} from './constants/pageDetails';
import {MINIPLAYER_HEIGHT, TAB_NAVIGATOR_HEIGHT} from './constants/styles';
import {PlayerPage} from './pages/PlayerPage';

const Tab = createBottomTabNavigator<RootTabParamList>();

const App = () => {
  const {isPlayerSetup} = useAppState();

  if (!isPlayerSetup) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={'#000'} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#18F2CE',
          animation: 'shift',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopWidth: 2,
            borderColor: '#18F2CE',
            height: TAB_NAVIGATOR_HEIGHT,
          },
          tabBarItemStyle: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarHideOnKeyboard: true,
          headerShown: false,
          sceneStyle: {
            marginBottom: MINIPLAYER_HEIGHT,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomePageDetails.Page}
          options={{
            tabBarIcon: HomePageDetails.icon,
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryPageDetails.Page}
          options={{
            tabBarIcon: LibraryPageDetails.icon,
          }}
        />
      </Tab.Navigator>
      <PlayerPage />
    </>
  );
};

export default App;
