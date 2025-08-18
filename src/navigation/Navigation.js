// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas existentes
import RegisterScreen from '../screens/RegisterScreen';
import VerificationScreen from '../screens/VerificationScreen';
import LoginScreen from '../screens/LoginScreen';
import IMCScreen from '../screens/IMCscreen'; 
import DashboardScreen from '../screens/DashboardScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import PasswordRecovery from '../screens/PasswordRecovery';

// Nuevas pantallas de productos
import ProductsList from '../screens/ProductsList';
import ProductDetail from '../screens/ProductDetail';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Pantallas de usuario */}
        <Stack.Screen name="IMCScreen" component={IMCScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="ProductsList" component={ProductsList} options={{ title: 'Productos', headerShown: true }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Detalle del Producto', headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
