import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
  const { email, verificationCookie } = route.params; // Recibimos email y cookie

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (code.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.2:4000/api/registerCustomers/verifyCodeEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: verificationCookie, // enviamos la cookie manualmente
        },
        body: JSON.stringify({ requireCode: code }),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        Alert.alert('Éxito', 'Correo verificado correctamente');
        navigation.navigate('Login'); // O a donde quieras redirigir
      } else {
        Alert.alert('Error', data.message || 'Código incorrecto');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu correo</Text>
      <Text style={styles.subtitle}>Ingresa el código enviado a tu correo</Text>

      <TextInput
        style={styles.input}
        placeholder="Código de verificación"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verificar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0B0F33',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 18 },
});

export default VerificationScreen;
