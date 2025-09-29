import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ route, navigation }) => {
  const userId = route?.params?.userId || null;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("No se recibió userId");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://bluefruitnutrition-production.up.railway.app/api/customers"
        );
        const data = await response.json();
        const currentUser = data.find((u) => u._id === userId);
        if (!currentUser) console.warn("Usuario no encontrado");
        setUserData(currentUser || null);
      } catch (error) {
        console.log("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const response = await fetch(
        `https://bluefruitnutrition-production.up.railway.app/api/customers/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            dateBirth: userData.dateBirth,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Éxito", "Perfil actualizado correctamente");
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      Alert.alert("Error", "Ocurrió un error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Aquí podrías limpiar AsyncStorage / Context / Redux según tu app
    Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }], // reemplaza con tu pantalla inicial
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a1a4f" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró el perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Blue Fruit</Text>
        <Text style={styles.subText}>better nutrition - better results</Text>
      </View>

      {/* Perfil */}
      <View style={styles.perfilContainer}>
        <Text style={styles.perfilLabel}>Perfil</Text>

        <View style={styles.imageBox}>
          <Image
            source={{ uri: userData.image || "https://via.placeholder.com/150" }}
            style={styles.image}
          />
        </View>

        <TextInput
          value={userData.name || ""}
          placeholder="Nombre"
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
        <TextInput
          value={userData.lastName || ""}
          placeholder="Apellido"
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
        />
        <TextInput
          value={userData.email || ""}
          placeholder="Correo"
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
        />
        <TextInput
          value={userData.phone || ""}
          placeholder="Teléfono"
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, phone: text })}
        />
        <TextInput
          value={userData.dateBirth ? userData.dateBirth.split("T")[0] : ""}
          placeholder="Fecha de nacimiento"
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, dateBirth: text })}
        />


        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  header: { backgroundColor: "#0a1a4f", padding: 20, alignItems: "center" },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  subText: { fontSize: 12, color: "#fff" },
  perfilContainer: { marginTop: 20, alignItems: "center", paddingHorizontal: 20 },
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
  image: { width: "100%", height: "100%", borderRadius: 10 },
  input: {
    width: "100%",
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: "#0a1a4f",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold" },
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
