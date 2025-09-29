import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { StatusBar } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const DATA = [
  { id: "1", name: "Ener Kik", price: 4.5 },
  { id: "2", name: "Ener Kik", price: 4.5 },
  { id: "3", name: "Ener Kik", price: 4.5},
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

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={item.img} style={styles.img} />
      <View style={styles.info}>
        <View style={styles.itemHeader}>
          <Text style={styles.name}>{item.name}</Text>
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

          <Text style={styles.qty}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQty(item.id, 1)}
          >
            <Icon name="add-outline" size={20} color="#0B1F50" />
          </TouchableOpacity>

          <Text style={styles.price}>${(item.price * item.qty).toFixed(2)}</Text>
          
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
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    contentContainerStyle={{ paddingBottom: 20 }}
    ListEmptyComponent={
      <Text style={styles.emptyText}>Tu carrito está vacío</Text>
    }
  />

  <TouchableOpacity
    style={styles.addMoreBtn}
    onPress={() => navigation.navigate("Productos")}
  >
    <Text style={styles.addMoreText}>Agregar más productos</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.payBtn} disabled={items.length === 0}>
    <Text style={styles.payText}>
      Ir a pagar {items.length > 0 ? `  $${total}` : ""}
    </Text>
  </TouchableOpacity>
</SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#0B1F50",
    textAlign: "center",
    letterSpacing: 1,
    paddingTop: 10,
    
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
  img: { width: 70, height: 70, borderRadius: 12, marginRight: 16 },
  info: { flex: 1, justifyContent: "center" },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 6, color: "#333" },
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
  payBtn: {
    backgroundColor: "#0B1F50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 16,
    marginHorizontal: 16,
    opacity: 1,
  },
  payText: { color: "#fff", fontSize: 20, fontWeight: "700" },

  addMoreBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
  },
  addMoreText: {
    color: "#0B1F50",
    fontWeight: "700",
    fontSize: 18,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#999",
  },
});
