import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Productos from '../screens/Productos';
import Home from '../screens/HomeScreen';
import IMC from '../screens/IMCscreen';
import CarritoScreen from '../screens/CarritoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route, navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario desde AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log('🔄 TabNavigator - Cargando usuario:', userString);
        
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
          console.log(' Usuario cargado en TabNavigator:', user);
        } else {
          console.warn(' No hay usuario en AsyncStorage');
          // Verificar si viene en route.params
          if (route?.params?.userData) {
            console.log(' Usuario encontrado en params:', route.params.userData);
            setUserData(route.params.userData);
            // Guardar en AsyncStorage para futuras cargas
            await AsyncStorage.setItem('user', JSON.stringify(route.params.userData));
          }
        }
      } catch (error) {
        console.error(' Error cargando usuario:', error);
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
    
    if (targetScreen && navigation && !isLoading) {
      console.log(' Navegando a:', targetScreen, 'con params:', screenParams);
      // Pequeño delay para asegurar que los tabs estén montados
      setTimeout(() => {
        navigation.navigate(targetScreen, screenParams);
      }, 100);
    }
  }, [route?.params?.screen, navigation, isLoading]);

  // Listener de teclado para iOS y Android
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

  // Listener para cambios en AsyncStorage (sincronización)
  useEffect(() => {
    const checkUserInterval = setInterval(async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          // Solo actualizar si hay cambios
          if (JSON.stringify(user) !== JSON.stringify(userData)) {
            console.log(' Usuario actualizado desde AsyncStorage');
            setUserData(user);
          }
        } else if (userData !== null) {
          // Si se borró el usuario de AsyncStorage, actualizar estado
          console.warn(' Usuario removido de AsyncStorage');
          setUserData(null);
        }
      } catch (error) {
        console.error(' Error verificando usuario:', error);
      }
    }, 2000); // Verificar cada 2 segundos

    return () => clearInterval(checkUserInterval);
  }, [userData]);

  // Combinar datos de route params y AsyncStorage (prioridad a userData del estado)
  const finalUserId = userData?.id || userData?._id || route?.params?.userId;
  const finalUserName = userData?.name || route?.params?.userName || userData?.email?.split('@')[0];
  const finalUserData = userData || route?.params?.userData;

  console.log(' Datos finales en TabNavigator:', {
    userId: finalUserId,
    userName: finalUserName,
    hasUserData: !!finalUserData,
    userDataKeys: finalUserData ? Object.keys(finalUserData) : []
  });

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <ActivityIndicator size="large" color="#0C133F" />
      </View>
    );
  }

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
        initialParams={{ 
          userId: finalUserId, 
          userName: finalUserName,
          userData: finalUserData 
        }}
        listeners={{
          focus: () => {
            console.log(' Home enfocado con userId:', finalUserId);
          }
        }}
      />
      <Tab.Screen 
        name="IMC" 
        component={IMC}
        initialParams={{ 
          userId: finalUserId, 
          userName: finalUserName,
          userData: finalUserData 
        }}
        listeners={{
          focus: () => {
            console.log(' IMC enfocado con userId:', finalUserId);
          }
        }}
      />
      <Tab.Screen 
        name="Productos" 
        component={Productos}
        initialParams={{ 
          userId: finalUserId, 
          userName: finalUserName,
          userData: finalUserData 
        }}
        listeners={{
          focus: () => {
            console.log(' Productos enfocado con userId:', finalUserId);
          }
        }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CarritoScreen}
        initialParams={{ 
          userId: finalUserId, 
          userName: finalUserName,
          userData: finalUserData 
        }}
        listeners={{
          focus: () => {
            console.log(' Carrito enfocado con userId:', finalUserId);
          }
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen}
        initialParams={{ 
          userId: finalUserId, 
          userName: finalUserName,
          userData: finalUserData 
        }}
        listeners={{
          focus: () => {
            console.log(' Perfil enfocado con userId:', finalUserId);
          }
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;