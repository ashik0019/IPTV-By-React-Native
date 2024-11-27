// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BengaliIPTV from '../screens/BengaliIPTV';
import TVDetailsScreen from '../screens/TVDetailsScreen';
import AdMobTest from '../screens/AdMobTest';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AdMobTest" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BengaliIPTV" component={BengaliIPTV} />
      <Stack.Screen name="AdMobTest" component={AdMobTest} />
      <Stack.Screen name="TVDetailsScreen" component={TVDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
