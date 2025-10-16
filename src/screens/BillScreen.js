import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://bluefruitnutrition-production.up.railway.app/api/Bill';

export default function BillScreen({ navigation, route }) {
  const [user, setUser] = useState(null);
  const [datosCompra, setDatosCompra] = useState(null);
  const [datosEnvio, setDatosEnvio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    cargarDatos();
    limpiarCarrito();
  }, []);

  const limpiarCarrito = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      console.log('✅ Carrito limpiado después de la compra');
    } catch (error) {
      console.error('❌ Error limpiando carrito:', error);
    }
  };

  const cargarDatos = async () => {
    try {
      console.log('🔍 Cargando datos...');
      
      // Cargar usuario desde AsyncStorage
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
        console.log('✅ Usuario cargado:', userData);
      }

      // Cargar datos de compra
      const compraString = await AsyncStorage.getItem('datosCompra');
      if (compraString) {
        const compra = JSON.parse(compraString);
        setDatosCompra(compra);
        console.log('✅ Datos compra cargados:', compra);
      }

      // Cargar datos de envío
      const envioString = await AsyncStorage.getItem('datosEnvio');
      if (envioString) {
        const envio = JSON.parse(envioString);
        setDatosEnvio(envio);
        console.log('✅ Datos envío cargados:', envio);
      }

      // Si los datos vienen por navegación (route.params)
      if (route?.params) {
        if (route.params.datosCompra) setDatosCompra(route.params.datosCompra);
        if (route.params.datosEnvio) setDatosEnvio(route.params.datosEnvio);
        if (route.params.user) setUser(route.params.user);
      }

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarFactura = async () => {
    console.log('🔽 INICIANDO DESCARGA DE FACTURA');
    
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    if (!user.id) {
      Alert.alert('Error', 'ID de usuario no encontrado');
      return;
    }

    setDescargando(true);

    try {
      const tipoUsuario = user.role === 'customer' ? 'cliente' : 'distribuidor';
      
      const datosFactura = {
        productos: datosCompra?.productos || [
          { nombre: "Producto Test", cantidad: 1, precio: 50.00 }
        ],
        total: datosCompra?.total || 50.00,
        orden: datosCompra?.orden || { numeroOrden: 'TEST-' + Date.now() },
        datosEnvio: datosEnvio || { 
          nombre: user.name || 'Cliente', 
          direccionCompleta: 'Dirección no especificada' 
        }
      };

      const params = new URLSearchParams({
        userId: user.id,
        tipo: tipoUsuario,
        datosCompra: JSON.stringify(datosFactura)
      });

      const url = `${API_URL}/pdf?${params.toString()}`;
      console.log('🔗 URL:', url);

      // Descargar el PDF
      const fileUri = FileSystem.documentDirectory + `factura_${datosFactura.orden.numeroOrden}.pdf`;
      
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      console.log('✅ PDF descargado:', downloadResult.uri);

      // Compartir el PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Factura de Compra',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Éxito', 'Factura descargada en: ' + fileUri);
      }

      // Navegar al Home después de descargar
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home' } }],
        });
      }, 1500);

    } catch (error) {
      console.error('❌ Error descargando factura:', error);
      Alert.alert('Error', 'No se pudo descargar la factura: ' + error.message);
    } finally {
      setDescargando(false);
    }
  };

  const handleEnviarCorreo = async () => {
    console.log('📧 INICIANDO ENVÍO DE EMAIL');
    
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setEnviandoEmail(true);

    try {
      const tipoUsuario = user.role === 'customer' ? 'cliente' : 'distribuidor';
      
      const datosFactura = {
        productos: datosCompra?.productos || [
          { nombre: "Producto Test", cantidad: 1, precio: 50.00 }
        ],
        total: datosCompra?.total || 50.00,
        orden: datosCompra?.orden || { numeroOrden: 'TEST-' + Date.now() },
        datosEnvio: datosEnvio || { 
          nombre: user.name || 'Cliente', 
          direccionCompleta: 'Dirección no especificada' 
        }
      };

      const payload = {
        userId: user.id,
        tipo: tipoUsuario,
        datosCompra: datosFactura
      };

      console.log('📤 Enviando payload:', payload);

      const response = await fetch(`${API_URL}/email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Respuesta:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email enviado:', result);
        Alert.alert('Éxito', '¡Factura enviada a tu correo exitosamente!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la factura');
      }

    } catch (error) {
      console.error('❌ Error enviando email:', error);
      Alert.alert('Error', 'No se pudo enviar la factura: ' + error.message);
    } finally {
      setEnviandoEmail(false);
    }
  };

  const volverAlHome = () => {
    // Limpiar datos de compra y envío del AsyncStorage
    AsyncStorage.multiRemove(['datosCompra', 'datosEnvio']);
    
    // Navegar al Home usando reset para limpiar el stack de navegación
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0c133f" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={volverAlHome}
          >
            <Ionicons name="arrow-back" size={24} color="#0c133f" />
          </TouchableOpacity>
        </View>

        {/* Ícono de éxito */}
        <View style={styles.successIcon}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>¡Compra Exitosa!</Text>
        <Text style={styles.subtitulo}>
          Gracias por tu compra, {user?.name || user?.email?.split('@')[0] || 'cliente'}
        </Text>

        {/* Tarjeta de Resumen */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={24} color="#0c133f" />
            <Text style={styles.cardTitle}>Resumen del Pedido</Text>
          </View>

          <View style={styles.divider} />

          {/* Información del pedido */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de Orden:</Text>
            <Text style={styles.infoValue}>
              {datosCompra?.orden?.numeroOrden || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('es-ES')}
            </Text>
          </View>

          {/* Lista de productos */}
          {datosCompra?.productos && datosCompra.productos.length > 0 && (
            <View style={styles.productosContainer}>
              <Text style={styles.productosTitle}>Productos:</Text>
              {datosCompra.productos.map((producto, index) => (
                <View key={index} style={styles.productoItem}>
                  <View style={styles.productoInfo}>
                    <Text style={styles.productoNombre}>{producto.nombre}</Text>
                    <Text style={styles.productoCantidad}>x{producto.cantidad}</Text>
                  </View>
                  <Text style={styles.productoPrecio}>
                    ${(producto.precio * producto.cantidad).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              ${datosCompra?.total?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* Información de envío */}
        {datosEnvio && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="location-outline" size={24} color="#0c133f" />
              <Text style={styles.cardTitle}>Datos de Envío</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.texto}>Teléfono: {datosEnvio.telefono}</Text>
            <Text style={styles.texto}>{datosEnvio.direccionCompleta}</Text>
            {datosEnvio.indicaciones && (
              <Text style={styles.texto}>Indicaciones: {datosEnvio.indicaciones}</Text>
            )}
          </View>
        )}

        {/* Mensaje informativo */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <Text style={styles.infoCardText}>
            Puedes descargar tu factura o recibirla directamente en tu correo electrónico
          </Text>
        </View>

        {/* Botones de acción */}
         <View style={styles.botonesContainer}>
           {/* <TouchableOpacity 
            style={[styles.boton, styles.botonPrimario]}
            onPress={handleEnviarCorreo}
            disabled={enviandoEmail}
          >
            {enviandoEmail ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="mail-outline" size={20} color="#fff" style={styles.icono} />
                <Text style={styles.botonTexto}>Enviar al Correo</Text>
              </>
            )}
          </TouchableOpacity>*/}

          <TouchableOpacity 
            style={[styles.boton, styles.botonSecundario]}
            onPress={handleDescargarFactura}
            disabled={descargando}
          >
            {descargando ? (
              <ActivityIndicator size="small" color="#0c133f" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#0c133f" style={styles.icono} />
                <Text style={[styles.botonTexto, styles.botonTextoSecundario]}>
                  Descargar PDF
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Botón para volver al inicio */}
        <TouchableOpacity 
          style={styles.botonHome}
          onPress={volverAlHome}
        >
          <Text style={styles.botonHomeTexto}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successCircle: {
    backgroundColor: '#f0fdf4',
    borderRadius: 60,
    padding: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c133f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c133f',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#0c133f',
    fontWeight: '600',
  },
  productosContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  productosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c133f',
    marginBottom: 12,
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productoInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productoNombre: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  productoCantidad: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c133f',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#0c133f',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c133f',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  texto: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
  botonesContainer: {
    gap: 12,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botonPrimario: {
    backgroundColor: '#0c133f',
  },
  botonSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0c133f',
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonTextoSecundario: {
    color: '#0c133f',
  },
  icono: {
    marginRight: 8,
  },
  botonHome: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonHomeTexto: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});