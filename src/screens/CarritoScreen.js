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
import Icon from "react-native-vector-icons/Ionicons";

const DATA = [
  { id: "1", name: "Ener Kik", price: 4.5, img: require("./assets/gel.png") },
  { id: "2", name: "Ener Kik", price: 4.5, img: require("./assets/gel.png") },
  { id: "3", name: "Ener Kik", price: 4.5, img: require("./assets/gel.png") },
];

export default function CarritoScreen() {
  const [items, setItems] = useState(
    DATA.map((item) => ({ ...item, qty: 1 }))
  );

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    );
  };

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.img} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => updateQty(item.id, -1)}>
            <Text style={styles.btn}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.qty}</Text>
          <TouchableOpacity onPress={() => updateQty(item.id, 1)}>
            <Text style={styles.btn}>+</Text>
          </TouchableOpacity>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.payBtn}>
        <Text style={styles.payText}>Ir a pagar   ${total}</Text>
      </TouchableOpacity>

      {/* Barra de navegación inferior */}
      <View style={styles.nav}>
        <Icon name="home-outline" size={26} color="#fff" />
        <Icon name="options-outline" size={26} color="#fff" />
        <Icon name="cart-outline" size={26} color="#fff" />
        <Icon name="person-outline" size={26} color="#fff" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 10 },
  item: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  img: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  controls: { flexDirection: "row", alignItems: "center" },
  btn: {
    fontSize: 22,
    width: 30,
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  qty: { marginHorizontal: 8, fontSize: 16 },
  price: { marginLeft: "auto", fontWeight: "600" },
  payBtn: {
    backgroundColor: "#0B1F50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0B1F50",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
