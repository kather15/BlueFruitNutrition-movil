import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

export default function CarritoScreen({ navigation }) {
  const [items, setItems] = useState([]);

  // 🔹 Cargar carrito desde AsyncStorage al abrir pantalla
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem("cart");
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error cargando carrito:", error);
      }
    };
    loadCart();
  }, []);

  // 🔹 Actualizar cantidad
  const updateQty = async (id, delta) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    );
    setItems(updated);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔹 Eliminar producto
  const removeItem = async (id) => {
    const filtered = items.filter((i) => i.id !== id);
    setItems(filtered);
    await AsyncStorage.setItem("cart", JSON.stringify(filtered));
  };

  // 🔹 Calcular total
  const total = items
    .reduce((sum, i) => sum + i.quantity * i.price, 0)
    .toFixed(2);

  // 🔹 Función para proceder al pago
  const handleProceedToCheckout = async () => {
    if (items.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de continuar");
      return;
    }

    try {
      // Preparar datos de la compra
      const datosCompra = {
        productos: items.map(item => ({
          nombre: item.name,
          cantidad: item.quantity,
          precio: item.price,
          imagen: item.image,
          sabor: item.flavor || ''
        })),
        total: parseFloat(total),
        orden: {
          numeroOrden: `ORD-${Date.now()}`,
          fecha: new Date().toISOString()
        }
      };

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('datosCompra', JSON.stringify(datosCompra));
      console.log('✅ Datos de compra guardados:', datosCompra);

      // Navegar al checkout
      navigation.navigate('Checkout');

    } catch (error) {
      console.error('❌ Error guardando datos de compra:', error);
      Alert.alert('Error', 'Hubo un problema al procesar tu compra. Intenta de nuevo.');
    }
  };

  // 🔹 Renderizar cada producto
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.img}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <View style={styles.itemHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.name}</Text>
            {item.flavor && (
              <Text style={styles.flavor}>Sabor: {item.flavor}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Icon name="close-circle" size={24} color="#0B1F50" />
          </TouchableOpacity>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQty(item.id, -1)}
          >
            <Icon name="remove-outline" size={20} color="#0B1F50" />
          </TouchableOpacity>

          <Text style={styles.qty}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQty(item.id, 1)}
          >
            <Icon name="add-outline" size={20} color="#0B1F50" />
          </TouchableOpacity>

          <Text style={styles.price}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Carrito</Text>
        <View style={styles.divider} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="cart-outline" size={80} color="#d1d5db" />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            <Text style={styles.emptySubtext}>
              Agrega productos para empezar
            </Text>
          </View>
        }
      />

      {/* Contenedor de botones con fondo */}
      <View style={styles.bottomContainer}>
        {items.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addMoreBtn}
          onPress={() => navigation.navigate("Productos")}
        >
          <Icon name="add-circle-outline" size={20} color="#0B1F50" />
          <Text style={styles.addMoreText}>Agregar más productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payBtn, { opacity: items.length === 0 ? 0.5 : 1 }]}
          disabled={items.length === 0}
          onPress={handleProceedToCheckout}
        >
          <Icon name="card-outline" size={22} color="#fff" />
          <Text style={styles.payText}>
            {items.length > 0 ? `Ir a pagar • $${total}` : "Carrito vacío"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#0B1F50",
    textAlign: "center",
    letterSpacing: 1,
    paddingTop: 10,
  },
  divider: {
    height: 2,
    backgroundColor: "#0B1F50",
    marginHorizontal: 60,
    marginBottom: 10,
  },
  listContent: { 
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  img: { 
    width: 70, 
    height: 70, 
    borderRadius: 12, 
    marginRight: 16,
    backgroundColor: '#f3f4f6',
  },
  info: { 
    flex: 1, 
    justifyContent: "center" 
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 4, 
    color: "#333" 
  },
  flavor: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "#d1e3ff",
    borderRadius: 6,
    padding: 6,
  },
  qty: {
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#0B1F50",
    minWidth: 24,
    textAlign: "center",
  },
  price: {
    marginLeft: "auto",
    fontWeight: "700",
    fontSize: 18,
    color: "#0B1F50",
  },
  
  // Contenedor vacío
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: "#1f2937",
  },
  emptySubtext: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
  },

  // Contenedor inferior con botones
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110, // Espacio extra para el tab bar
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1F50',
  },
  addMoreBtn: {
    flexDirection: 'row',
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  addMoreText: {
    color: "#0B1F50",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 4,
  },
  payBtn: {
    flexDirection: 'row',
    backgroundColor: "#0B1F50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#0B1F50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    gap: 8,
  },
  payText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700",
    marginLeft: 4,
  },
});