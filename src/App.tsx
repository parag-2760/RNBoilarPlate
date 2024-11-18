/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {RootStackNavigator} from './navigation/RootStackNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <RootStackNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
