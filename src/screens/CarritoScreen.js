import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DATA = [
  { 
    id: "1", 
    name: "Ener Kik", 
    price: 4.5,
    image: "https://via.placeholder.com/100",
    description: "Gel energético"
  },
  { 
    id: "2", 
    name: "Ener Kik", 
    price: 4.5,
    image: "https://via.placeholder.com/100",
    description: "Gel energético"
  },
  { 
    id: "3", 
    name: "Ener Kik", 
    price: 4.5,
    image: "https://via.placeholder.com/100",
    description: "Gel energético"
  },
];

export default function CarritoScreen({ navigation }) {
  const [items, setItems] = useState(
    DATA.map((item) => ({ ...item, qty: 1 }))
  );

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = subtotal.toFixed(2);

  const handleCheckout = async () => {
    try {
      // Preparar datos del carrito para guardar
      const carritoData = items.map(item => ({
        id: item.id,
        nombre: item.name,
        precio: item.price,
        cantidad: item.qty,
        image: item.image
      }));

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('carrito', JSON.stringify(carritoData));
      
      // Navegar a Checkout
      navigation.navigate('Checkout');
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || "https://via.placeholder.com/100" }} 
          style={styles.productImage} 
        />
      </View>
      
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            {item.description && (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQty(item.id, -1)}
            >
              <Ionicons name="remove" size={18} color="#0C133F" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.qty}</Text>

            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQty(item.id, 1)}
            >
              <Ionicons name="add" size={18} color="#0C133F" />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.itemPrice}>
              ${(item.price * item.qty).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="cart-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos para comenzar tu compra
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("Productos")}
      >
        <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.emptyButtonText}>Explorar Productos</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
          <Text style={styles.headerSubtitle}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearCart}
          >
            <Ionicons name="trash" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de productos */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          items.length > 0 && styles.listContentWithFooter
        ]}
        ListEmptyComponent={EmptyCart}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer fijo con resumen y botones */}
      {items.length > 0 && (
        <View style={styles.footer}>
          {/* Resumen de precios */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {/* Botón agregar más */}
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={() => navigation.navigate("Productos")}
            >
              <Ionicons name="add-circle-outline" size={20} color="#0C133F" />
              <Text style={styles.addMoreText}>Agregar más</Text>
            </TouchableOpacity>

            {/* Botón pagar */}
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Ir a pagar</Text>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0C133F",
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Lista
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  listContentWithFooter: {
    paddingBottom: 220, // Espacio para el footer
  },

  // Item Card
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: { 
    width: 70, 
    height: 70,
    resizeMode: 'contain',
  },
  itemInfo: { 
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1f2937",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 4,
  },
  quantityBtn: {
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#0C133F",
    minWidth: 24,
    textAlign: "center",
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemPrice: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0C133F",
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    backgroundColor: '#0C133F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C133F',
  },
  buttonsContainer: {
    gap: 10,
  },
  addMoreButton: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addMoreText: {
    color: "#0C133F",
    fontWeight: "700",
    fontSize: 15,
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: "#0C133F",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#0C133F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  checkoutButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
});