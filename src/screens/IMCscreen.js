import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Slider } from 'react-native-elements';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState('');
  const [clasificacion, setClasificacion] = useState(0);
  const [clasificacionTexto, setClasificacionTexto] = useState('');

  const calcularIMC = () => {
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
  };

  return (
    <View style={styles.container}>
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
        <Slider
  style={{ width: '100%', height: 40 }}
  value={clasificacion}
  minimumValue={0}
  maximumValue={1}
  step={0.33}
  minimumTrackTintColor="#001F54"
  maximumTrackTintColor="#ccc"
  thumbStyle={{ backgroundColor: '#001F54' }}
  disabled
/>


        <View style={styles.sliderLabels}>
          <Text>Bajo peso</Text>
          <Text>Normal</Text>
          <Text>Sobrepeso</Text>
          <Text>Obesidad</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // centra verticalmente
    alignItems: 'center', // centra horizontalmente
  },
  form: {
    width: '90%', // se adapta al ancho de la pantalla
    maxWidth: 400, // no pasa de 400 px en tablets
    padding: 20,
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
    marginTop: -5,
  },
});
