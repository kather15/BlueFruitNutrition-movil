import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('Salir', 'Cerrando sesión...');
    // Aquí podés borrar el token si lo guardaste en AsyncStorage
    navigation.replace('Login'); // Vuelve al login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Dashboard</Text>
      <Text style={styles.subtitle}>Solo clientes pueden ver esta pantalla</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#555' },
  button: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DashboardScreen;
