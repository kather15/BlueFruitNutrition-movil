import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Progress from 'react-native-progress';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState('');
  const [clasificacion, setClasificacion] = useState(0);
  const [clasificacionTexto, setClasificacionTexto] = useState('');
  const [productoRecomendado, setProductoRecomendado] = useState(null);

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

    // Determinar clasificación
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

    // Obtener producto aleatorio desde backend
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
          />
          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
          />

          <TouchableOpacity style={styles.button} onPress={calcularIMC}>
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>

          {resultado !== '' && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>IMC: {resultado}</Text>
              <Text style={styles.classificationText}>{clasificacionTexto}</Text>
            </View>
          )}

          <Text style={styles.label}>Clasificación del IMC</Text>
          <Progress.Bar
            progress={clasificacion} // 0 a 1
            width={null}
            height={20}
            borderRadius={10}
            color="#001F54"
            unfilledColor="#ccc"
          />

          <View style={styles.sliderLabels}>
            <Text>Bajo peso</Text>
            <Text>Normal</Text>
            <Text>Sobrepeso</Text>
            <Text>Obesidad</Text>
          </View>

          {productoRecomendado ? (
            <View style={styles.productContainer}>
              <Text style={styles.productTitle}>Producto recomendado:</Text>
              {productoRecomendado.image && (
                <Image
                  source={{ uri: productoRecomendado.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.productName}>{productoRecomendado.name}</Text>
              <Text style={styles.productDescription}>{productoRecomendado.description}</Text>
              <Text style={styles.productPrice}>${productoRecomendado.price}</Text>
            </View>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 10, color: '#888' }}>
              No se encontró ningún producto.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0B1541',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  label: { marginBottom: 10, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  resultContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: { fontSize: 18, fontWeight: 'bold', color: '#0B1541' },
  classificationText: { fontSize: 16, color: '#555' },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  productContainer: {
    backgroundColor: '#eaf4ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  productTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#0B1541' },
  productDescription: { fontSize: 14, color: '#333', textAlign: 'center', marginVertical: 5 },
  productPrice: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
  productImage: { width: 120, height: 120, marginBottom: 10, borderRadius: 10 },
});
