import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard() {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
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
          source={{ uri: "../assets/gel.png" }} 
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Ener Balance</Text>
        <Text style={styles.price}>$2.50</Text>

        <Text style={styles.label}>Sabor:</Text>
        <Text style={styles.flavor}> </Text>

        <Text style={styles.description}>
         Reppo es un Gel Energético de “recuperación” específica, que combina la dextrosa y Palatinose™ 
         con aminoácidos de cadena ramificada (BCAA) y vitamina C. 
         Está formulado para contribuir una reconstrucción de las fibras musculares post–ejercicio. 
         De esta manera colabora a evitar el catabolismo muscular, y así mejorando el rendimiento.
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

          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

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
    fontSize: 20,
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
