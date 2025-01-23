import React from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';
import {useAppState} from './Providers/AppProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from './schema/routes';
import {HomePageDetails, LibraryPageDetails} from './constants/pageDetails';
import {TAB_NAVIGATOR_HEIGHT} from './constants/styles';

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
  );
};

export default App;
