import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) return Alert.alert('Error', 'Ingrese su correo');
    setLoading(true);
    try {
      const res = await fetch('https://bluefruitnutrition1.onrender.com/api/passwordRecovery/requestCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Éxito', data.message);
        setCodeSent(true);
      } else {
        Alert.alert('Error', data.message || 'Algo salió mal');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return Alert.alert('Error', 'Ingrese el código');
    setLoading(true);
    try {
      const res = await fetch('https://bluefruitnutrition1.onrender.com/api/passwordRecovery/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok || data.message === "Code verified successfully") {
        Alert.alert('Éxito', data.message);
        navigation.navigate('NewPassword');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo verificar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {!codeSent ? (
        <>
          <Text style={styles.title}>Olvidar Contraseña</Text>
          <Text style={styles.subtitle}>Ingresa tus datos a continuación</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Verificación</Text>
          <Text style={styles.subtitle}>Te enviamos un código a tu correo !</Text>
        </>
      )}

      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          {!codeSent ? (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Correo electrónico o número de teléfono"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.button, { opacity: email.trim() ? 1 : 0.7 }]} 
                onPress={handleSendCode}
                disabled={!email.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Enviar Código</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Código"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, { opacity: code.trim() ? 1 : 0.7 }]} 
                onPress={handleVerifyCode}
                disabled={!code.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Verificar Código</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton}
                onPress={() => { setCodeSent(false); setCode(''); }}
              >
                <Text style={styles.resendText}>Reenviar</Text>
              </TouchableOpacity>
            </>
          )}
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
  resendButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;