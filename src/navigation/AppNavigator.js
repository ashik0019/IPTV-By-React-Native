// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BengaliIPTV from '../screens/BengaliIPTV';
import TVDetailsScreen from '../screens/TVDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BengaliIPTV" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BengaliIPTV" component={BengaliIPTV} />
      <Stack.Screen name="TVDetailsScreen" component={TVDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
