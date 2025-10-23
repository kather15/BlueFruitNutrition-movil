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
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy'; 
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://bluefruitnutrition-production.up.railway.app/api/Bill';
const ORDENES_API_URL = 'https://bluefruitnutrition-production.up.railway.app/api/ordenes';

export default function BillScreen({ navigation, route }) {
  const [user, setUser] = useState(null);
  const [datosCompra, setDatosCompra] = useState(null);
  const [datosEnvio, setDatosEnvio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState(false);
  const [errorCreandoOrden, setErrorCreandoOrden] = useState(false);

  useEffect(() => {
    inicializarPantalla();
  }, []);

  const inicializarPantalla = async () => {
    await cargarDatos();
    await limpiarCarrito();
  };

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
      
      // Cargar usuario
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

      // Si los datos vienen por navegación
      if (route?.params) {
        if (route.params.datosCompra) setDatosCompra(route.params.datosCompra);
        if (route.params.datosEnvio) setDatosEnvio(route.params.datosEnvio);
        if (route.params.user) setUser(route.params.user);
      }

      // Esperar un momento antes de crear la orden
      setTimeout(async () => {
        await crearOrdenEnBackend();
      }, 500);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de la compra');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Crear orden en el backend del administrador (ADAPTADO AL SCHEMA)
  const crearOrdenEnBackend = async () => {
    try {
      if (ordenCreada) {
        console.log('⚠️ Orden ya fue creada previamente');
        return;
      }

      console.log('📦 Creando orden en el backend...');

      // Obtener datos frescos de AsyncStorage
      const userString = await AsyncStorage.getItem('user');
      const compraString = await AsyncStorage.getItem('datosCompra');
      const envioString = await AsyncStorage.getItem('datosEnvio');

      if (!userString || !compraString) {
        console.warn('⚠️ Faltan datos para crear la orden');
        setErrorCreandoOrden(true);
        return;
      }

      const userData = JSON.parse(userString);
      const compraData = JSON.parse(compraString);
      const envioData = envioString ? JSON.parse(envioString) : null;

      console.log('🔍 Datos parseados:');
      console.log('  - Usuario:', userData);
      console.log('  - Compra:', compraData);
      console.log('  - Envío:', envioData);

      // ✅ Preparar productos EXACTAMENTE como el schema lo requiere
      const productos = compraData.productos.map(producto => ({
        id: producto.id || String(Date.now() + Math.random()), // ⬅️ Campo requerido
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad
        // ❌ NO enviar: subtotal, sabor, imagen (no están en el schema)
      }));

      // Calcular total de items
      const totalItems = productos.reduce((sum, p) => sum + p.cantidad, 0);

      // ✅ Preparar payload EXACTAMENTE como el backend lo espera
      const ordenPayload = {
        numeroOrden: compraData.orden?.numeroOrden || `ORD-${Date.now()}`,
        fecha: compraData.orden?.fecha || new Date().toISOString(),
        total: compraData.total,
        items: totalItems,
        productos: productos,
        estado: 'En proceso' // ⬅️ Debe ser "En proceso" o "Terminado"
        // ❌ NO enviar: cliente, direccionEnvio (no están en el schema)
      };

      console.log('📤 Enviando orden al servidor (ADAPTADO AL SCHEMA):');
      console.log('URL:', ORDENES_API_URL);
      console.log('Payload:', JSON.stringify(ordenPayload, null, 2));

      const response = await fetch(ORDENES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenPayload),
      });

      console.log('📥 Status del servidor:', response.status);
      
      // Intentar parsear la respuesta
      let result;
      try {
        const responseText = await response.text();
        console.log('📥 Respuesta cruda:', responseText);
        result = JSON.parse(responseText);
        console.log('📥 Respuesta parseada:', result);
      } catch (parseError) {
        console.error('❌ Error parseando respuesta:', parseError);
        result = { mensaje: 'Error al parsear respuesta del servidor' };
      }

      if (response.ok) {
        console.log('✅ Orden creada exitosamente');
        setOrdenCreada(true);
        setErrorCreandoOrden(false);
        
        if (result._id) {
          await AsyncStorage.setItem('ultimaOrdenId', result._id);
        }

        // 🔹 IMPORTANTE: Guardar cliente y envío por separado para tu control interno
        // (ya que el backend no los guarda en la orden)
        if (envioData) {
          const datosOrdenCompleta = {
            ordenId: result._id,
            numeroOrden: ordenPayload.numeroOrden,
            cliente: {
              id: userData.id || userData._id,
              nombre: userData.name || 'Cliente',
              email: userData.email || '',
              telefono: envioData?.telefono || ''
            },
            direccionEnvio: envioData,
            fecha: ordenPayload.fecha
          };
          await AsyncStorage.setItem('ultimaOrdenCompleta', JSON.stringify(datosOrdenCompleta));
          console.log('💾 Datos completos guardados localmente para referencia');
        }
        
        Alert.alert(
          '¡Orden Creada!',
          `Tu orden ${ordenPayload.numeroOrden} ha sido registrada correctamente.`,
          [{ text: 'Entendido' }]
        );
      } else {
        console.error('❌ Error del servidor:', result);
        setErrorCreandoOrden(true);
        
        Alert.alert(
          'Error al crear orden',
          `El servidor respondió: ${result.mensaje || result.message || 'Error desconocido'}`,
          [
            { text: 'Reintentar', onPress: () => crearOrdenEnBackend() },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error creando orden:', error);
      console.error('❌ Stack:', error.stack);
      setErrorCreandoOrden(true);
      
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        [
          { text: 'Reintentar', onPress: () => crearOrdenEnBackend() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  // ✅ Función para descargar factura (con API LEGACY)
  const handleDescargarFactura = async () => {
    console.log('🔽 INICIANDO DESCARGA DE FACTURA');
    
    if (!user || !user.id) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setDescargando(true);

    try {
      const tipoUsuario = user.role === 'customer' ? 'cliente' : 'distribuidor';
      
      const datosFactura = {
        productos: datosCompra?.productos || [],
        total: datosCompra?.total || 0,
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

      const fileName = `factura_${datosFactura.orden.numeroOrden}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      console.log('📥 Descargando a:', fileUri);

      // ✅ Usando la API LEGACY de FileSystem
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      
      console.log('✅ PDF descargado:', uri);

      // Compartir o guardar el PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Factura de Compra',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert(
          'Factura Descargada', 
          `Tu factura ha sido guardada en: ${uri}`
        );
      }

      setTimeout(() => {
        volverAlHome();
      }, 1500);

    } catch (error) {
      console.error('❌ Error descargando factura:', error);
      Alert.alert('Error', 'No se pudo descargar la factura. Intenta nuevamente.');
    } finally {
      setDescargando(false);
    }
  };

  const volverAlHome = async () => {
    try {
      await AsyncStorage.multiRemove(['datosCompra', 'datosEnvio']);
      console.log('✅ Datos de compra y envío limpiados');
      
      const userString = await AsyncStorage.getItem('user');
      
      if (userString) {
        const userData = JSON.parse(userString);
        
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'Main',
            params: { 
              screen: 'Home',
              params: {
                userId: userData.id || userData._id,
                userName: userData.name,
                userData: userData
              }
            }
          }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('❌ Error en volverAlHome:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0c133f" />
          <Text style={styles.loadingText}>Procesando tu orden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Ícono de éxito */}
        <View style={styles.successIcon}>
          <View style={styles.successCircle}>
            <Ionicons 
              name={errorCreandoOrden ? "warning" : "checkmark-circle"} 
              size={80} 
              color={errorCreandoOrden ? "#f59e0b" : "#10b981"} 
            />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>
          {errorCreandoOrden ? '⚠️ Orden Pendiente' : '¡Orden Confirmada!'}
        </Text>
        <Text style={styles.subtitulo}>
          {errorCreandoOrden 
            ? 'Hubo un problema al registrar tu orden en el sistema' 
            : 'Tu pedido ha sido registrado exitosamente'
          }
        </Text>

        {/* Información de la orden */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={24} color="#0c133f" />
            <Text style={styles.cardTitle}>Detalles de la Orden</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de Orden:</Text>
            <Text style={styles.infoValue}>
              {datosCompra?.orden?.numeroOrden || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('es-SV', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={[styles.infoValue, { color: errorCreandoOrden ? '#f59e0b' : '#10b981' }]}>
              {errorCreandoOrden ? 'Error al registrar' : 'En proceso'}
            </Text>
          </View>

          {/* Productos */}
          <View style={styles.productosContainer}>
            <Text style={styles.productosTitle}>Productos:</Text>
            {datosCompra?.productos?.map((producto, index) => (
              <View key={index} style={styles.productoItem}>
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre}>
                    {producto.nombre}
                    {producto.sabor && ` (${producto.sabor})`}
                  </Text>
                  <Text style={styles.productoCantidad}>
                    x{producto.cantidad}
                  </Text>
                </View>
                <Text style={styles.productoPrecio}>
                  ${(producto.precio * producto.cantidad).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

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
        <View style={[styles.infoCard, errorCreandoOrden && styles.warningCard]}>
          <Ionicons 
            name={errorCreandoOrden ? "warning" : "information-circle"} 
            size={24} 
            color={errorCreandoOrden ? "#d97706" : "#3b82f6"} 
          />
          <Text style={[styles.infoCardText, errorCreandoOrden && styles.warningText]}>
            {errorCreandoOrden
              ? 'No se pudo registrar tu orden en el sistema administrativo. Por favor contacta a soporte.'
              : 'Puedes descargar tu factura. Tu orden ha sido registrada correctamente.'
            }
          </Text>
        </View>

        {/* Botones de acción */}
        {!errorCreandoOrden && (
          <View style={styles.botonesContainer}>
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
        )}

        {/* Botón para reintentar si hubo error */}
        {errorCreandoOrden && (
          <TouchableOpacity 
            style={[styles.boton, styles.botonPrimario]}
            onPress={crearOrdenEnBackend}
          >
            <Ionicons name="refresh" size={20} color="#fff" style={styles.icono} />
            <Text style={styles.botonTexto}>Reintentar Registro</Text>
          </TouchableOpacity>
        )}

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
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
  warningCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
  warningText: {
    color: '#92400e',
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
    marginBottom: 12,
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
    marginTop: 8,
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