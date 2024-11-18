import {createStackNavigator} from '@react-navigation/stack';
import {TEST_SCREEN} from '../utils/constants/ScreenConstants';
import {TestScreen} from '../screens/TestScreen';

const AppStack = createStackNavigator();
export const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <AppStack.Screen name={TEST_SCREEN} component={TestScreen} />
    </AppStack.Navigator>
  );
};
