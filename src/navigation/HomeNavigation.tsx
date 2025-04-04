import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationRoutes from '../routes/routes';
import HomeScreen from '../screens/Home/HomeScreen';

export default function HomeNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationRoutes.homeScreen} component={HomeScreen} />
    </Stack.Navigator>
  );
}
