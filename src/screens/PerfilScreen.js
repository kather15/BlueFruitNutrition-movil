// PerfilScreen.js
import React from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const PerfilScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header con logo */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Blue Fruit</Text>
        <Text style={styles.subText}>better nutrition - better results</Text>
      </View>

      {/* Perfil */}
      <View style={styles.perfilContainer}>
        <Text style={styles.perfilLabel}>Perfil</Text>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: "gel.png" }} 
            style={styles.image}
          />
        </View>

        {/* Campos */}
        <TextInput placeholder="Nombre" style={styles.input} />
        <TextInput placeholder="Deporte" style={styles.input} />
        <TextInput placeholder="Suscripción" style={styles.input} />
      </View>

      {/* Footer navegación */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Icon name="home-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="list-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="cart-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    backgroundColor: "#0a1a4f",
    padding: 20,
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subText: {
    fontSize: 12,
    color: "#fff",
  },
  perfilContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  perfilLabel: {
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#0a1a4f",
  },
  imageBox: {
    width: 150,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#0a1a4f",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
