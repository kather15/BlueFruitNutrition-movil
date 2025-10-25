import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Productos from '../screens/Productos';
import HomeScreen from '../screens/HomeScreen';
import IMC from '../screens/IMCscreen';
import CarritoScreen from '../screens/CarritoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route, navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const tabRef = useRef(); //  Ref para navegar

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
        } else if (route?.params?.userData) {
          setUserData(route.params.userData);
          await AsyncStorage.setItem('user', JSON.stringify(route.params.userData));
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [route?.params]);

  // Navegar a la pantalla específica si se pasa como parámetro
  useEffect(() => {
    const targetScreen = route?.params?.screen;
    const screenParams = route?.params?.params;

    if (targetScreen && tabRef.current && !isLoading) {
      setTimeout(() => {
        tabRef.current.navigate(targetScreen, screenParams);
      }, 100);
    }
  }, [route?.params?.screen, route?.params?.params, isLoading]);

  // Listener de teclado
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Sincronizar AsyncStorage
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          if (JSON.stringify(user) !== JSON.stringify(userData)) {
            setUserData(user);
          }
        } else if (userData !== null) {
          setUserData(null);
        }
      } catch (error) {
        console.error(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [userData]);

  // Datos finales combinando AsyncStorage y route.params
  const finalUserId = userData?.id || userData?._id || route?.params?.userId;
  const finalUserName = userData?.name || route?.params?.userName || userData?.email?.split('@')[0];
  const finalUserData = userData || route?.params?.userData;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#0C133F" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      ref={tabRef} //  Asignar el ref
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
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'IMC') iconName = focused ? 'calculator' : 'calculator-outline';
          else if (route.name === 'Productos') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Carrito') iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={26} color={color} />
              {focused && <View style={{ width: 14, height: 2, backgroundColor: '#fff', borderRadius: 1, marginTop: 3 }} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ userId: finalUserId, userName: finalUserName, userData: finalUserData }} />
      <Tab.Screen name="IMC" component={IMC} initialParams={{ userId: finalUserId, userName: finalUserName, userData: finalUserData }} />
      <Tab.Screen name="Productos" component={Productos} initialParams={{ userId: finalUserId, userName: finalUserName, userData: finalUserData }} />
      <Tab.Screen name="Carrito" component={CarritoScreen} initialParams={{ userId: finalUserId, userName: finalUserName, userData: finalUserData }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ userId: finalUserId, userName: finalUserName, userData: finalUserData }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
