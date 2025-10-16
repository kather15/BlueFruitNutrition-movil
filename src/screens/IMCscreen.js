import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function IMCScreen() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState('');
  const [clasificacion, setClasificacion] = useState(0);
  const [clasificacionTexto, setClasificacionTexto] = useState('');
  const [productoRecomendado, setProductoRecomendado] = useState(null);
  const navigation = useNavigation();

  const calcularIMC = async () => {
    if (!peso || !altura) {
      alert('Por favor ingresa ambos valores');
      return;
    }

    const alturaMetros = parseFloat(altura) / 100;
    const pesoKg = parseFloat(peso);
    if (isNaN(alturaMetros) || isNaN(pesoKg) || alturaMetros <= 0 || pesoKg <= 0) {
      alert('Ingresa valores válidos');
      return;
    }

    const imc = pesoKg / (alturaMetros * alturaMetros);
    setResultado(imc.toFixed(2));

    if (imc < 18.5) {
      setClasificacion(0);
      setClasificacionTexto('Bajo peso');
    } else if (imc < 25) {
      setClasificacion(0.33);
      setClasificacionTexto('Peso normal');
    } else if (imc < 30) {
      setClasificacion(0.66);
      setClasificacionTexto('Sobrepeso');
    } else {
      setClasificacion(1);
      setClasificacionTexto('Obesidad');
    }

    try {
      const res = await fetch('http://bluefruitnutrition-production.up.railway.app/api/products/random');
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const producto = await res.json();
      if (producto && producto.name) setProductoRecomendado(producto);
      else setProductoRecomendado(null);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      setProductoRecomendado(null);
    }
  };

  const getClasificacionColor = () => {
    if (clasificacion === 0) return '#3b82f6';
    if (clasificacion === 0.33) return '#10b981';
    if (clasificacion === 0.66) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="fitness" size={32} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Calculadora IMC</Text>
            <Text style={styles.headerSubtitle}>Índice de Masa Corporal</Text>
          </View>

          {/* Card Principal */}
          <View style={styles.mainCard}>
            <View style={styles.form}>
              {/* Input Peso */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="barbell-outline" size={20} color="#0C133F" />
                  <Text style={styles.inputLabel}>Peso</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="70"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={peso}
                    onChangeText={setPeso}
                  />
                  <Text style={styles.inputUnit}>kg</Text>
                </View>
              </View>

              {/* Input Altura */}
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="resize-outline" size={20} color="#0C133F" />
                  <Text style={styles.inputLabel}>Altura</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="170"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={altura}
                    onChangeText={setAltura}
                  />
                  <Text style={styles.inputUnit}>cm</Text>
                </View>
              </View>

              {/* Botón Calcular */}
              <TouchableOpacity style={styles.button} onPress={calcularIMC}>
                <Ionicons name="calculator" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Calcular IMC</Text>
              </TouchableOpacity>

              {/* Resultado */}
              {resultado !== '' && (
                <View style={[styles.resultContainer, { borderLeftColor: getClasificacionColor() }]}>
                  <View style={styles.resultHeader}>
                    <View>
                      <Text style={styles.resultLabel}>Tu IMC es</Text>
                      <Text style={styles.resultText}>{resultado}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: getClasificacionColor() }]}>
                      <Text style={styles.badgeText}>{clasificacionTexto}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Barra de clasificación */}
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Clasificación del IMC</Text>
                <Progress.Bar
                  progress={clasificacion}
                  width={null}
                  height={12}
                  borderRadius={6}
                  color={getClasificacionColor()}
                  unfilledColor="#e5e7eb"
                  borderWidth={0}
                  style={styles.progressBar}
                />
                <View style={styles.sliderLabels}>
                  <View style={styles.labelItem}>
                    <View style={[styles.labelDot, { backgroundColor: '#3b82f6' }]} />
                    <Text style={styles.labelText}>Bajo</Text>
                  </View>
                  <View style={styles.labelItem}>
                    <View style={[styles.labelDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.labelText}>Normal</Text>
                  </View>
                  <View style={styles.labelItem}>
                    <View style={[styles.labelDot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.labelText}>Sobre</Text>
                  </View>
                  <View style={styles.labelItem}>
                    <View style={[styles.labelDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.labelText}>Obesidad</Text>
                  </View>
                </View>
              </View>

              {/* Producto Recomendado */}
              {productoRecomendado ? (
                <View style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <Ionicons name="gift-outline" size={24} color="#0C133F" />
                    <Text style={styles.productHeaderText}>Producto recomendado para ti</Text>
                  </View>
                  
                  {productoRecomendado.image && (
                    <View style={styles.productImageContainer}>
                      <Image
                        source={{ uri: productoRecomendado.image }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  
                  <Text style={styles.productName}>{productoRecomendado.name}</Text>
                  <Text style={styles.productDescription} numberOfLines={3}>
                    {productoRecomendado.description}
                  </Text>
                  
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>${productoRecomendado.price}</Text>
                    <TouchableOpacity
                      style={styles.productButton}
                      onPress={() => navigation.navigate('ProductDetail', { id: productoRecomendado._id })}
                    >
                      <Text style={styles.productButtonText}>Ver Producto</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : resultado !== '' ? (
                <View style={styles.noProductCard}>
                  <Ionicons name="information-circle-outline" size={40} color="#9ca3af" />
                  <Text style={styles.noProductText}>
                    No se encontró ningún producto en este momento
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0C133F',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mainCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C133F',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    color: '#1f2937',
  },
  inputUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#0C133F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#0C133F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0C133F',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 25,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressBar: {
    marginBottom: 12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelItem: {
    alignItems: 'center',
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    color: '#6b7280',
  },
  productCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C133F',
    marginLeft: 8,
  },
  productImageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C133F',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C133F',
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C133F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#0C133F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  noProductCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  noProductText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});