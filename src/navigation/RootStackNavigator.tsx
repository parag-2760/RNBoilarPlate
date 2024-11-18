import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {APP_NAVIGATION_STACK} from '../utils/constants/ScreenConstants';
import {AppStackNavigator} from './AppStackNavigator';

// create root stack navigator for app
const Stack = createStackNavigator();

/**
 * Explanation: Add only Modals/Dialogs here, which need to be render over the screen,
 * and need to have transparent or semi-transparent background with no action bar
 *
 * If you need to add normal screens, add it in AppStackNavigator
 */
export const RootStackNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={APP_NAVIGATION_STACK}>
          <Stack.Screen
            name={APP_NAVIGATION_STACK}
            component={AppStackNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
