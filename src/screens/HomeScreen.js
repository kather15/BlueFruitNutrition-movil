import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [userName, setUserName] = useState('Usuario');
  const [greeting, setGreeting] = useState('¡Buenos días!');

useEffect(() => {
  console.log('Params recibidos:', route.params);

  const hour = new Date().getHours();
  if (hour >= 6 && hour > 12) setGreeting('¡Buenos días!');
  else if (hour >= 12 && hour < 20) setGreeting('¡Buenas tardes!');
  else setGreeting('¡Buenas noches!');

  if (route.params?.userName) {
    setUserName(route.params.userName);
  } else if (route.params?.userId) {
    fetchUserNameFromAPI(route.params.userId);
  } else {
    console.warn('No se recibió ni userName ni userId');
  }
}, [route]);


  const fetchUserNameFromAPI = async (userId) => {
    try {
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/customers/${userId}`);
      const data = await response.json();
      setUserName(data?.name || 'Usuario');
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      setUserName('Usuario');
    }
  };

  const menuOptions = [
    { title: 'Mi Perfil', subtitle: 'Información personal', action: () => navigation.navigate('Profile') },
    { title: 'Calcular masa corporal', subtitle: 'Ver mi plan personalizado', action: () => navigation.navigate('IMCScreen') },

  ];

  const quickActions = [
    { title: 'Registrar Comida', color: '#10b981', action: () => navigation.navigate('FoodLog') },
    { title: 'Peso Hoy', color: '#f59e0b', action: () => navigation.navigate('WeightLog') }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.subtitle}>Bienvenido a BlueFruitNutricion</Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.content}>


          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Menú Principal</Text>
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuCard}
                onPress={option.action}
              >
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{option.title}</Text>
                  <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.menuArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.sectionTitle}>Consejo del Día</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Hidratación</Text>
              <Text style={styles.tipText}>
                Recuerda beber al menos 8 vasos de agua al día para mantener tu metabolismo activo y tu piel saludable.
              </Text>
            </View>
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
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 50,
    minHeight: '100%',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  quickActionsContainer: { marginBottom: 30 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  quickActionCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: { color: '#ffffff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  menuContainer: { marginBottom: 30 },
  menuCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  menuSubtitle: { fontSize: 14, color: '#6b7280' },
  menuArrow: {
    width: 30,
    height: 30,
    backgroundColor: '#0C133F',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  tipContainer: { marginBottom: 20 },
  tipCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0C133F',
  },
  tipTitle: { fontSize: 16, fontWeight: '600', color: '#0C133F', marginBottom: 8 },
  tipText: { fontSize: 14, color: '#374151', lineHeight: 20 },
});

export default HomeScreen;
