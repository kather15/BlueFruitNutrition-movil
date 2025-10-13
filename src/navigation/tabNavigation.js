import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Keyboard } from 'react-native';

import Productos from '../screens/Productos';
import Home from '../screens/HomeScreen';
import IMC from '../screens/IMCscreen';
import CarritoScreen from '../screens/CarritoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  // Obtener userId y userName de los parámetros de ruta
  const { userId, userName } = route?.params || {};
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: Platform.OS === 'ios' ? 70 : 60,
          backgroundColor: '#0C133F',
          borderRadius: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 5,
          opacity: keyboardVisible ? 0 : 1,
          transform: [{ translateY: keyboardVisible ? 100 : 0 }],
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({ focused, color }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'IMC') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={26} color={color} />
              {focused && (
                <View
                  style={{
                    width: 14,
                    height: 2,
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        initialParams={{ userId, userName }}
      />
      <Tab.Screen 
        name="IMC" 
        component={IMC}
        initialParams={{ userId, userName }}
      />
      <Tab.Screen 
        name="Productos" 
        component={Productos}
        initialParams={{ userId, userName }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CarritoScreen}
        initialParams={{ userId, userName }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen}
        initialParams={{ userId, userName }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;