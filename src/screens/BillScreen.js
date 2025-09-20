// PantallaFactura.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { Ionicons } from '@expo/vector-icons';

//Esto es el diseño me falta conectarlo y hacer que funcione 

const PantallaFactura = () => {
  const facturaHTML = `
    <html>
      <body>
        <h1>Factura</h1>
        <p>Cliente: Juan Pérez</p>
        <p>Fecha: 20/09/2025</p>
        <p>Total: $150.00</p>
      </body>
    </html>
  `;

  const handleDescargar = async () => {
    const { uri } = await Print.printToFileAsync({ html: facturaHTML });
    await Sharing.shareAsync(uri);
  };

  const handleEnviarGmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      MailComposer.composeAsync({
        recipients: ['cliente@correo.com'],
        subject: 'Factura de compra',
        body: 'Adjunto la factura de su compra.',
      });
    } else {
      alert('No se pudo abrir la app de correo.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={36} color="#0c133f" />
        <Text style={styles.titulo}>Factura</Text>
      </View>

      {/* Tarjeta de contenido */}
      <View style={styles.card}>
        <Text style={styles.texto}>Cliente: Juan Pérez</Text>
        <Text style={styles.texto}>Fecha: 20/09/2025</Text>
        <Text style={styles.texto}>Total: $150.00</Text>

        <View style={styles.botones}>
          <TouchableOpacity style={styles.boton} onPress={handleEnviarGmail}>
            <Ionicons name="mail-outline" size={18} color="#fff" style={styles.icono} />
            <Text style={styles.botonTexto}>Enviar por Gmail</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boton} onPress={handleDescargar}>
            <Ionicons name="download-outline" size={18} color="#fff" style={styles.icono} />
            <Text style={styles.botonTexto}>Descargar</Text>
          </TouchableOpacity>
        </View>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0c133f', 
    marginTop: 10,
  },
  card: {
    backgroundColor: '#f5f7fa', 
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  texto: {
    color: '#0c133f',
    fontSize: 16,
    marginBottom: 10,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c133f', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 14,
  },
  icono: {
    marginRight: 6,
  },
});

export default PantallaFactura;
