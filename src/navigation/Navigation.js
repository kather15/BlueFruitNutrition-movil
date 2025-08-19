// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/RegisterScreen';
import VerificationScreen from '../screens/VerificationScreen';
import LoginScreen from '../screens/LoginScreen.js'; // Si tienes pantalla de login
import IMCScreen from '../screens/IMCscreen'; 
import DashboardScreen from '../screens/DashboardScreen'; // Si tienes pantalla de dashboard
import NewPasswordScreen from '../screens/NewPasswordScreen'; // Si tienes pantalla de nueva contraseña
import PasswordRecovery from '../screens/PasswordRecovery';
import HomeScreen from '../screens/HomeScreen.js';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IMCScreen" component={IMCScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
                <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
