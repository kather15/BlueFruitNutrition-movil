import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { API_URL } from '../config.js';

const VerificationScreen = ({ route, navigation }) => {
  const { email, verificationCookie } = route.params;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = code.trim().length > 0;

  const handleVerifyCode = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor ingresa el código de verificación');
      return;
    }

    setLoading(true);

    try {

     const response = await fetch(`${API_URL}/registerCustomers/verifyCodeEmail`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: verificationCookie,
          },
          body: JSON.stringify({ requireCode: code }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Éxito', 'Correo verificado correctamente');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Error', data.message || 'Código incorrecto');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.subtitle}>Ingresa el código enviado a tu correo</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Código de verificación"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, { opacity: isFormValid && !loading ? 1 : 0.5 }]}
          onPress={handleVerifyCode}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verificar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#0B0F33',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  input: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 30,
    fontSize: 16,
    color: '#000',
    width: '80%',
  },
  button: {
    backgroundColor: '#0B0F33',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
