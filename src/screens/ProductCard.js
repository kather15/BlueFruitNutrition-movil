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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductCard() {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // ✅ Función para agregar al carrito
  const agregarAlCarrito = async () => {
    try {
      // Datos del producto actual
      const producto = {
        id: "gel-001",
        nombre: "Ener Balance",
        precio: 2.5,
        imagen: "https://ruta-tu-imagen.png", // reemplazá si tenés otra imagen
        cantidad: quantity,
      };

      // Obtener carrito actual
      const carritoActual = JSON.parse(await AsyncStorage.getItem("carrito")) || [];

      // Buscar si el producto ya está
      const productoExistente = carritoActual.find(p => p.id === producto.id);

      let nuevoCarrito;
      if (productoExistente) {
        // Si ya existe, solo sumar la cantidad
        nuevoCarrito = carritoActual.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + quantity }
            : p
        );
      } else {
        // Si no existe, agregarlo
        nuevoCarrito = [...carritoActual, producto];
      }

      // Guardar en AsyncStorage
      await AsyncStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

      Alert.alert("Agregado al carrito", "Tu producto se agregó correctamente.");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Alert.alert("Error", "No se pudo agregar al carrito.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>Blue Fruit</Text>
        <Text style={styles.slogan}>Better Nutrition • Better Results</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require("../assets/gel.png")} // usa require en vez de uri para assets locales
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Ener Balance</Text>
        <Text style={styles.price}>$2.50</Text>

        <Text style={styles.label}>Sabor:</Text>
        <Text style={styles.flavor}></Text>

        <Text style={styles.description}>
          Reppo es un Gel Energético de “recuperación” específica, que combina
          la dextrosa y Palatinose™ con aminoácidos de cadena ramificada (BCAA)
          y vitamina C. Está formulado para contribuir una reconstrucción de las
          fibras musculares post–ejercicio, colaborando a evitar el catabolismo
          muscular y mejorando el rendimiento.
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

          {/* Botón funcional */}
          <TouchableOpacity style={styles.buyBtn} onPress={agregarAlCarrito}>
            <Text style={styles.buyText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#0b1442",
    padding: 20,
    alignItems: "center",
  },
  logo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  slogan: { color: "#cfcfcf", fontSize: 12, marginTop: 2 },
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
  image: { width: "100%", height: 180 },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  price: { fontSize: 18, color: "#2a9d8f", marginVertical: 5 },
  label: { fontSize: 14, fontWeight: "bold" },
  flavor: { fontSize: 20, marginBottom: 10 },
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
  counterBtn: { padding: 8, backgroundColor: "#f2f2f2" },
  counterText: { paddingHorizontal: 12, fontSize: 16, fontWeight: "bold" },
  buyBtn: {
    backgroundColor: "#0b1442",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
