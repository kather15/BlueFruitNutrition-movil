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
import BillScreen from "../screens/BillScreen.js"
import ProductDetail from '../screens/VerProductos.js';
import DashboardScreen from '../screens/DashboardScreen';
import PaymentScreen from '../screens/PaymentScreen';
import CheckoutScreen from '../screens/checkout';
import StoresMapScreen from '../screens/StoresMapScreen.js';

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
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

        {/* Pantalla Principal con Tabs (incluye Home, IMC, Productos, Carrito, Perfil) */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* Pantallas secundarias (sin tabs) */}
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetail} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Bill" 
          component={BillScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="StoresMap" 
          component={StoresMapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;