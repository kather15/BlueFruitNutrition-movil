// navigation/tabNavigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Platform } from 'react-native';

import Productos from '../screens/Productos';
import Home from '../screens/HomeScreen';
import IMC from '../screens/IMCscreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'IMC') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Productos') {
            iconName = focused ? 'cart' : 'cart-outline';
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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="IMC" component={IMC} />
      <Tab.Screen name="Productos" component={Productos} />
    </Tab.Navigator>
  );
};

export default TabNavigator;