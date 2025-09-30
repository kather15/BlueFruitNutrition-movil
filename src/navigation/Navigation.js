// navigation/Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas de autenticación
import RegisterScreen from '../screens/RegisterScreen';
import VerificationScreen from '../screens/VerificationScreen';
import LoginScreen from '../screens/LoginScreen';
import PasswordRecovery from '../screens/PasswordRecovery';
import NewPasswordScreen from '../screens/NewPasswordScreen';

// Pantallas principales
import TabNavigator from './tabNavigation.js';
import IMCScreen from '../screens/IMCscreen'; 
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen.js';
import BillScreen from "../screens/BillScreen.js"
import ProductDetail from '../screens/VerProductos.js';
import PerfilScreen from '../screens/PerfilScreen.js';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        {/* Pantallas de Autenticación */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="ProfileScreen" component={PerfilScreen} />


        {/* Pantalla Principal con Tabs */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* Pantallas secundarias (sin tabs) */}
        <Stack.Screen 
          name="IMCScreen" 
          component={IMCScreen}
          options={{ headerShown: true, title: 'Calculadora IMC' }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetail} 
          options={{ headerShown: true, title: 'Detalle del Producto' }}
        />
        <Stack.Screen 
          name="Bill" 
          component={BillScreen}
          options={{ headerShown: true, title: 'Factura' }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;