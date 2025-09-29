import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';

const NewPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = password.trim() && confirmPassword.trim();

  const handleNewPassword = async () => {
    if (!password || !confirmPassword) return Alert.alert('Error', 'Complete todos los campos');
    if (password !== confirmPassword) return Alert.alert('Error', 'Las contraseñas no coinciden');

    setLoading(true);
    try {
      const res = await fetch('https://bluefruitnutrition-production.up.railway.app/api/passwordRecovery/newPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password })
      });
      const data = await res.json();
      if (res.ok || data.message === "Password updated successfully") {
        Alert.alert('Éxito', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Nueva Contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tus datos a continuación</Text>

      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nueva Contraseña"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { opacity: isFormValid ? 1 : 0.7 }]}
            onPress={handleNewPassword}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Ingresar Contraseña</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C133F',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0C133F',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#374151',
  },
  button: {
    backgroundColor: '#0C133F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#0C133F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewPasswordScreen;