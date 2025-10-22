import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PasswordListScreen from '../screens/PasswordListScreen';
import PasswordEditScreen from '../screens/PasswordEditScreen';
import PasswordDetailScreen from '../screens/PasswordDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Passwords" component={PasswordListScreen} />
      <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="PasswordEdit" component={PasswordEditScreen} options={{ title: 'Edit Password' }} />
    </Stack.Navigator>
  );
}
