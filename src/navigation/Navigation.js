// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';


// Pantallas existentes
import RegisterScreen from '../screens/RegisterScreen';
import VerificationScreen from '../screens/VerificationScreen';
import LoginScreen from '../screens/LoginScreen';
import IMCScreen from '../screens/IMCscreen'; 
import DashboardScreen from '../screens/DashboardScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import PasswordRecovery from '../screens/PasswordRecovery';
import HomeScreen from '../screens/HomeScreen.js';
import checkout from "../screens/checkout.js";
import shoppingcart from "../screens/CarritoScreen.js";
import BillScreen from "../screens/BillScreen.js";
import PaymentScreen from '../screens/PaymentScreen.js';


// Nuevas pantallas de productos
import ProductsList from '../screens/Productos.js';
import ProductDetail from '../screens/VerProductos.js';
import TabNavigator from '../navigation/tabNavigation.js';
import ProfileScreen from '../screens/PerfilScreen.js';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>

       {/* Pantallas de inicio */}
      <Stack.Navigator initialRouteName="PaymentScreen" screenOptions={{ headerShown: false }}>
        
        {/* Pantallas de usuario */}
        <Stack.Screen name="IMCScreen" component={IMCScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="prueba" component={TabNavigator} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} /> 
                <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />


        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="ProductsList" component={ProductsList} options={{ title: 'Productos', headerShown: true }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Detalle del Producto', headerShown: true }} />
         <Stack.Screen name="Bill" component={BillScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
