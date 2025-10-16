import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard() {
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: "Ener Balance",
    price: 2.5,
    flavor: "Naranja",
    image: "https://bluefruitnutrition.com/images/gel.png", // URL directa o tuya
  };

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // 🔹 Función para agregar producto al carrito
  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si ya está en el carrito, solo aumenta la cantidad
        existingItem.quantity += quantity;
      } else {
        // Si no está, lo agrega nuevo
        cart.push({ ...product, quantity });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      Alert.alert("Éxito", "Producto agregado al carrito 🛒");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Alert.alert("Error", "No se pudo agregar al carrito");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Blue Fruit</Text>
        <Text style={styles.slogan}>Better Nutrition • Better Results</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <Text style={styles.label}>Sabor:</Text>
        <Text style={styles.flavor}>{product.flavor}</Text>

        <Text style={styles.description}>
          Reppo es un Gel Energético de “recuperación” específica, que combina
          dextrosa y Palatinose™ con aminoácidos de cadena ramificada (BCAA) y
          vitamina C. Formulado para reconstruir las fibras musculares
          post–ejercicio y mejorar el rendimiento.
        </Text>

        {/* Quantity and Button */}
        <View style={styles.actions}>
          <View style={styles.counter}>
            <TouchableOpacity onPress={decrease} style={styles.counterBtn}>
              <Ionicons name="remove" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantity}</Text>
            <TouchableOpacity onPress={increase} style={styles.counterBtn}>
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buyBtn} onPress={addToCart}>
            <Text style={styles.buyText}>Agregar al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0b1442",
    padding: 20,
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  slogan: {
    color: "#cfcfcf",
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    margin: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    color: "#2a9d8f",
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  flavor: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginVertical: 10,
    textAlign: "justify",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  counterBtn: {
    padding: 8,
    backgroundColor: "#f2f2f2",
  },
  counterText: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  buyBtn: {
    backgroundColor: "#0b1442",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
