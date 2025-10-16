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
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C133F" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#d1d5db" />
        <Text style={styles.emptyText}>No se encontró el perfil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con degradado */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <Text style={styles.headerSubtitle}>Administra tu información personal</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card de imagen de perfil */}
        <View style={styles.profileImageCard}>
          <View style={styles.imageContainer}>
            
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name} {userData.lastName}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          {/* Input Nombre */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="person" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Nombre</Text>
            </View>
            <TextInput
              value={userData.name || ""}
              placeholder="Tu nombre"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          </View>

          {/* Input Apellido */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="person-outline" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Apellido</Text>
            </View>
            <TextInput
              value={userData.lastName || ""}
              placeholder="Tu apellido"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              onChangeText={(text) => setUserData({ ...userData, lastName: text })}
            />
          </View>

          {/* Input Email */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="mail" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
            </View>
            <TextInput
              value={userData.email || ""}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
          </View>

          {/* Input Teléfono */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="call" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Teléfono</Text>
            </View>
            <TextInput
              value={userData.phone || ""}
              placeholder="2250-0000"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
            />
          </View>

          {/* Input Fecha de Nacimiento */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="calendar" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
            </View>
            <TextInput
              value={userData.dateBirth ? userData.dateBirth.split("T")[0] : ""}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              onChangeText={(text) => setUserData({ ...userData, dateBirth: text })}
            />
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botón Cerrar Sesión */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#6b7280',
  },

  // Header
  headerGradient: {
    backgroundColor: '#0C133F',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // Card de Imagen de Perfil
  profileImageCard: {
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#f0f9ff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0C133F',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Formulario
  formSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  // Botones
  saveButton: {
    backgroundColor: '#0C133F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row',
    shadowColor: '#0C133F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});