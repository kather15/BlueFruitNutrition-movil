import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { API_URL } from '../config.js';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('Usuario');
  const [greeting, setGreeting] = useState('¡Buenos días!');
  const [dailyTip, setDailyTip] = useState(null);

  useEffect(() => {
    // Saludo según hora
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setGreeting('¡Buenos días!');
    else if (hour >= 12 && hour < 20) setGreeting('¡Buenas tardes!');
    else setGreeting('¡Buenas noches!');

    // Obtener recomendación aleatoria
    fetchRandomRecommendation();

    // Obtener datos del usuario desde params
    const { userName: paramName, userId } = route?.params || {};

    console.log('Params recibidos en Home:', route?.params);

    if (paramName) {
      setUserName(paramName);
    } else if (userId) {
      fetchUserNameFromAPI(userId);
    } else {
      console.warn('⚠️ No se recibió ni userName ni userId en HomeScreen');
    }
  }, [route]);

  // 🔹 Obtener nombre desde API si solo tenemos userId
  const fetchUserNameFromAPI = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/customers/${userId}`);
      const data = await response.json();

      if (data?.name) setUserName(data.name);
      else setUserName('Usuario');
    } catch (error) {
      console.error('❌ Error al obtener el nombre del usuario:', error);
      setUserName('Usuario');
    }
  };

  // 🔹 Menú
  const menuOptions = [
    { title: 'Mi Perfil', subtitle: 'Información personal', action: () => navigation.navigate('ProfileScreen', { userId: route?.params?.userId }) },
    { title: 'Calcular masa corporal', subtitle: 'Ver mi plan personalizado', action: () => navigation.navigate('IMCScreen') },
  ];

  // 🔹 Recomendación del día
  const fetchRandomRecommendation = async () => {
    try {
      const response = await fetch(
        'https://bluefruitnutrition-production.up.railway.app/api/recommendation'
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setDailyTip(data[randomIndex]);
      }
    } catch (error) {
      console.error('❌ Error al obtener recomendaciones:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.subtitle}>Bienvenido a BlueFruitNutrición</Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.content}>
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Menú Principal</Text>
            {menuOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.menuCard} onPress={option.action}>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{option.title}</Text>
                  <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.menuArrow}><Text style={styles.arrowText}>→</Text></View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.sectionTitle}>Consejo del Día</Text>
            {dailyTip ? (
              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>💡 {dailyTip.title}</Text>
                <Text style={styles.tipText}>{dailyTip.text}</Text>
              </View>
            ) : (
              <Text style={{ color: '#6b7280' }}>Cargando consejo...</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C133F' },
  header: { backgroundColor: '#0C133F', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 30 },
  welcomeContainer: { alignItems: 'center' },
  greeting: { fontSize: 24, color: '#ffffff', fontWeight: '500', marginBottom: 5 },
  userName: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#ffffff', textAlign: 'center', opacity: 0.8 },
  mainContainer: { flex: 1, backgroundColor: '#0C133F' },
  content: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 30, paddingTop: 30, paddingBottom: 50, minHeight: '100%' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  menuContainer: { marginBottom: 30 },
  menuCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e5e7eb' },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  menuSubtitle: { fontSize: 14, color: '#6b7280' },
  menuArrow: { width: 30, height: 30, backgroundColor: '#0C133F', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  tipContainer: { marginBottom: 20 },
  tipCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 20, borderLeftWidth: 4, borderLeftColor: '#0C133F' },
  tipTitle: { fontSize: 16, fontWeight: '600', color: '#0C133F', marginBottom: 8 },
  tipText: { fontSize: 14, color: '#374151', lineHeight: 20 },
});

export default HomeScreen;
