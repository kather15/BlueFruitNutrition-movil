import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'http://192.168.1.2:4000/api/registerCustomers';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState(''); // 'YYYY-MM-DD'
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const isAdult = (birth) => {
    const birthDate = new Date(birth);
    const todayDate = new Date();
    const age = todayDate.getFullYear() - birthDate.getFullYear();
    const m = todayDate.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && (m > 0 || (m === 0 && todayDate.getDate() >= birthDate.getDate())));
  };

  const isFormValid =
    name.trim() &&
    lastname.trim() &&
    email.trim() &&
    password.trim() &&
    phone.trim() &&
    birthdate.trim();

  const handleRegister = async () => {
    console.log('Datos enviados al backend:', {
      name,
      lastName: lastname, // Cambia aquí
      email,
      password,
      dateBirth: birthdate, // Cambia aquí
    });

    if (!isAdult(birthdate)) {
      Alert.alert('Error', 'Debes ser mayor de edad para registrarte');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          lastName: lastname, // Cambia aquí
          email,
          password,
          dateBirth: birthdate, // Cambia aquí
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Registro exitoso', data.message || 'Usuario registrado correctamente');
        setName('');
        setLastname('');
        setEmail('');
        setPassword('');
        setPhone('');
        setBirthdate('');
      } else {
        if (data.message && data.message.toLowerCase().includes('existe')) {
          Alert.alert('Error', 'Ya hay un usuario registrado con ese correo electrónico o teléfono');
        } else {
          Alert.alert('Error', data.message || 'Ocurrió un error en el registro');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setBirthdate(isoDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear una cuenta</Text>
        <Text style={styles.subtitle}>Ingresa tus datos a continuación</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: birthdate ? '#000' : '#999' }}>
            {birthdate || 'Selecciona fecha de nacimiento'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthdate ? new Date(birthdate) : maxDate}
            mode="date"
            display="default"
            maximumDate={maxDate}
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity
          style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Crear Cuenta</Text>
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
  },
  input: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  toggleText: {
    color: '#0B0F33',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0B0F33',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
