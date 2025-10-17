import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';

const departamentos = {
  "Ahuachapán": ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio", "Guaymango", "Jujutla", "San Francisco Menéndez", "San Lorenzo", "San Pedro Puxtla", "Tacuba", "Turín"],
  
  "Santa Ana": ["Candelaria de la Frontera", "Chalchuapa", "Coatepeque", "El Congo", "El Porvenir", "Masahuat", "Metapán", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santa Ana", "Santa Rosa Guachipilín", "Santiago de la Frontera", "Texistepeque"],
  
  "Sonsonate": ["Acajutla", "Armenia", "Caluco", "Cuisnahuat", "Izalco", "Juayúa", "Nahuizalco", "Nahulingo", "Salcoatitán", "San Antonio del Monte", "San Julián", "Santa Catarina Masahuat", "Santa Isabel Ishuatán", "Santo Domingo Guzmán", "Sonsonate", "Sonzacate"],
  
  "Chalatenango": ["Agua Caliente", "Arcatao", "Azacualpa", "Chalatenango", "Citala", "Comalapa", "Concepción Quezaltepeque", "Dulce Nombre de María", "El Carrizal", "El Paraíso", "La Laguna", "La Palma", "La Reina", "Las Vueltas", "Nueva Concepción", "Nueva Trinidad", "Nombre de Jesús", "Ojos de Agua", "Potonico", "San Antonio de la Cruz", "San Antonio Los Ranchos", "San Fernando", "San Francisco Lempa", "San Francisco Morazán", "San Ignacio", "San Isidro Labrador", "San José Cancasque", "San José Las Flores", "San Luis del Carmen", "San Miguel de Mercedes", "San Rafael", "Santa Rita", "Tejutla"],
  
  "La Libertad": ["Antiguo Cuscatlán", "Chiltiupán", "Ciudad Arce", "Colón", "Comasagua", "Huizúcar", "Jayaque", "Jicalapa", "La Libertad", "Santa Tecla", "Nuevo Cuscatlán", "San Juan Opico", "Quezaltepeque", "Sacacoyo", "San José Villanueva", "San Matías", "San Pablo Tacachico", "Talnique", "Tamanique", "Teotepeque", "Tepecoyo", "Zaragoza"],
  
  "San Salvador": ["Aguilares", "Apopa", "Ayutuxtepeque", "Cuscatancingo", "Ciudad Delgado", "El Paisnal", "Guazapa", "Ilopango", "Mejicanos", "Nejapa", "Panchimalco", "Rosario de Mora", "San Marcos", "San Martín", "San Salvador", "Santiago Texacuangos", "Santo Tomás", "Soyapango", "Tonacatepeque"],
  
  "Cuscatlán": ["Candelaria", "Cojutepeque", "El Carmen", "El Rosario", "Monte San Juan", "Oratorio de Concepción", "San Bartolomé Perulapía", "San Cristóbal", "San José Guayabal", "San Pedro Perulapán", "San Rafael Cedros", "San Ramón", "Santa Cruz Analquito", "Santa Cruz Michapa", "Suchitoto", "Tenancingo"],
  
  "La Paz": ["Cuyultitán", "El Rosario", "Jerusalén", "Mercedes La Ceiba", "Olocuilta", "Paraíso de Osorio", "San Antonio Masahuat", "San Emigdio", "San Francisco Chinameca", "San Juan Nonualco", "San Juan Talpa", "San Juan Tepezontes", "San Luis La Herradura", "San Luis Talpa", "San Miguel Tepezontes", "San Pedro Masahuat", "San Pedro Nonualco", "San Rafael Obrajuelo", "Santa María Ostuma", "Santiago Nonualco", "Tapalhuaca", "Zacatecoluca"],
  
  "Cabañas": ["Cinquera", "Dolores", "Guacotecti", "Ilobasco", "Jutiapa", "San Isidro", "Sensuntepeque", "Tejutepeque", "Victoria"],
  
  "San Vicente": ["Apastepeque", "Guadalupe", "San Cayetano Istepeque", "San Esteban Catarina", "San Ildefonso", "San Lorenzo", "San Sebastián", "San Vicente", "Santa Clara", "Santo Domingo", "Tecoluca", "Tepetitán", "Verapaz"],
  
  "Usulután": ["Alegría", "Berlín", "California", "Concepción Batres", "El Triunfo", "Ereguayquín", "Estanzuelas", "Jiquilisco", "Jucuapa", "Jucuarán", "Mercedes Umaña", "Nueva Granada", "Ozatlán", "Puerto El Triunfo", "San Agustín", "San Buenaventura", "San Dionisio", "San Francisco Javier", "Santa Elena", "Santa María", "Santiago de María", "Tecapán", "Usulután"],
  
  "San Miguel": ["Carolina", "Chapeltique", "Chinameca", "Chirilagua", "Ciudad Barrios", "Comacarán", "El Tránsito", "Lolotique", "Moncagua", "Nueva Guadalupe", "Nuevo Edén de San Juan", "Quelepa", "San Antonio del Mosco", "San Gerardo", "San Jorge", "San Luis de la Reina", "San Miguel", "San Rafael Oriente", "Sesori", "Uluazapa"],
  
  "Morazán": ["Arambala", "Cacaopera", "Chilanga", "Corinto", "Delicias de Concepción", "El Divisadero", "El Rosario", "Gualococti", "Guatajiagua", "Joateca", "Jocoaitique", "Jocoro", "Lolotiquillo", "Meanguera", "Osicala", "Perquín", "San Carlos", "San Fernando", "San Francisco Gotera", "San Isidro", "San Simón", "Sensembra", "Sociedad", "Torola", "Yamabal", "Yoloaiquín"],
  
  "La Unión": ["Anamorós", "Bolívar", "Concepción de Oriente", "Conchagua", "El Carmen", "El Sauce", "Intipucá", "La Unión", "Lilisque", "Meanguera del Golfo", "Nueva Esparta", "Pasaquina", "Polorós", "San Alejo", "San José", "Santa Rosa de Lima", "Yayantique", "Yucuaiquín"]
};

export default function CheckoutScreen({ navigation }) {
  const [telefono, setTelefono] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');

  const handleTelefonoChange = (text) => {
    const numeros = text.replace(/[^0-9]/g, '');
    const telefonoLimitado = numeros.slice(0, 8);
    setTelefono(telefonoLimitado);
  };

  const formatearTelefono = (numero) => {
    if (numero.length <= 4) return numero;
    return `${numero.slice(0, 4)}-${numero.slice(4)}`;
  };

  const handleConfirm = async () => {
    if (telefono.length !== 8) {
      Alert.alert('Número inválido', 'El teléfono debe tener exactamente 8 dígitos');
      return;
    }

    if (!numeroCasa.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa tu número de casa o apartamento');
      return;
    }

    if (!departamento) {
      Alert.alert('Campo requerido', 'Por favor selecciona un departamento');
      return;
    }

    if (!municipio) {
      Alert.alert('Campo requerido', 'Por favor selecciona un municipio');
      return;
    }

    try {
      const datosEnvio = {
        telefono: formatearTelefono(telefono),
        numeroCasa: numeroCasa.trim(),
        indicaciones: indicaciones.trim(),
        departamento: departamento,
        municipio: municipio,
        direccionCompleta: `${numeroCasa.trim()}, ${municipio}, ${departamento}`
      };

      await AsyncStorage.setItem('datosEnvio', JSON.stringify(datosEnvio));
      console.log('✅ Datos de envío guardados:', datosEnvio);

      navigation.navigate('Payment', datosEnvio);

    } catch (error) {
      console.error('❌ Error guardando datos:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los datos. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C133F" />
      
      <LinearGradient
        colors={['#0C133F', '#1a2456']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Información de Entrega</Text>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Ionicons name="location" size={20} color="#fff" />
            </View>
            <Text style={styles.stepText}>Dirección</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.stepCircle}>
              <Ionicons name="card" size={20} color="#9ca3af" />
            </View>
            <Text style={[styles.stepText, styles.stepInactive]}>Pago</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.stepCircle}>
              <Ionicons name="checkmark-circle" size={20} color="#9ca3af" />
            </View>
            <Text style={[styles.stepText, styles.stepInactive]}>Confirmar</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Datos de Contacto</Text>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="call" size={18} color="#0C133F" />
              <Text style={styles.label}>Número de Teléfono *</Text>
            </View>
            <TextInput
              value={formatearTelefono(telefono)}
              onChangeText={handleTelefonoChange}
              placeholder="2250-0000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={9}
              style={styles.input}
            />
            <Text style={styles.helperText}>
              {telefono.length}/8 dígitos
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Dirección de Entrega</Text>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="home" size={18} color="#0C133F" />
              <Text style={styles.label}>Número de Casa / Apartamento *</Text>
            </View>
            <TextInput
              value={numeroCasa}
              onChangeText={setNumeroCasa}
              placeholder="Ej: Casa #25, Apto 3B, Piso 2"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="map" size={18} color="#0C133F" />
              <Text style={styles.label}>Departamento *</Text>
            </View>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  console.log('Departamento seleccionado:', value);
                  setDepartamento(value);
                  setMunicipio('');
                }}
                items={Object.keys(departamentos).map((dep) => ({
                  label: dep,
                  value: dep,
                }))}
                placeholder={{ 
                  label: 'Selecciona un departamento...', 
                  value: '',
                  color: '#9ca3af'
                }}
                style={pickerSelectStyles}
                value={departamento}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>

          {departamento && (
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="location" size={18} color="#0C133F" />
                <Text style={styles.label}>Municipio *</Text>
              </View>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    console.log('Municipio seleccionado:', value);
                    setMunicipio(value);
                  }}
                  items={departamentos[departamento].map((mun) => ({
                    label: mun,
                    value: mun,
                  }))}
                  placeholder={{ 
                    label: 'Selecciona un municipio...', 
                    value: '',
                    color: '#9ca3af'
                  }}
                  style={pickerSelectStyles}
                  value={municipio}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="information-circle" size={18} color="#0C133F" />
              <Text style={styles.label}>Indicaciones adicionales (opcional)</Text>
            </View>
            <TextInput
              value={indicaciones}
              onChangeText={setIndicaciones}
              placeholder="Ej: Portón azul, frente al parque..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Entrega Segura</Text>
              <Text style={styles.infoText}>
                Tu información está protegida y solo será usada para la entrega
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Continuar al Pago</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingRight: 40,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingRight: 40,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#9ca3af',
  },
  iconContainer: {
    top: 16,
    right: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  scrollView: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: '#0C133F',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0C133F',
  },
  stepInactive: {
    color: '#9ca3af',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
    marginBottom: 32,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#0C133F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C133F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});