// PaymentScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // si usas Expo
// si NO usas Expo: import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(360, width - 40);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.62);

export default function PaymentScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  // interpolaciones para frente y reverso
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  // Nota: useNativeDriver: false para compatibilidad con backfaceVisibility en Android.
  const flipToBack = () => {
    Animated.timing(animatedValue, {
      toValue: 180,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setFlipped(true));
  };

  const flipToFront = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setFlipped(false));
  };

  const toggleFlip = () => {
    if (flipped) flipToFront();
    else flipToBack();
  };

  // helpers de formato
  const formatCardNumber = (digits) => {
    if (!digits) return "1234 5678 9010 1234";
    return digits.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 16); // max 16 dígitos
    setCardNumber(digits);
  };

  const handleExpiryChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  };

  const handleCvvChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pago con tarjeta</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack?.()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {/* Contenedor de tarjeta - manejamos front y back con Animated */}
      <TouchableOpacity activeOpacity={0.9} onPress={toggleFlip} style={{ alignSelf: "center" }}>
        <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
          {/* FRONT */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.logoPlaceholder} />
              <View style={styles.chip} />
            </View>

            <Text style={styles.cardNumberText}>
              {formatCardNumber(cardNumber) /* muestra con espacios */}
            </Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.smallLabel}>TITULAR</Text>
                <Text style={styles.footerText}>{cardHolder || "Nombre Apellido"}</Text>
              </View>
              <View>
                <Text style={styles.smallLabel}>VENCIMIENTO</Text>
                <Text style={styles.footerText}>{expiry || "MM/AA"}</Text>
              </View>
            </View>
          </Animated.View>

          {/* BACK */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                position: "absolute",
                top: 0,
                left: 0,
                transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
              },
            ]}
          >
            <View style={styles.blackStrip} />
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>{cardHolder ? cardHolder.toUpperCase() : "NOMBRE APELLIDO"}</Text>
              </View>
              <View style={styles.cvvBox}>
                <Text style={styles.cvvLabel}>CVV</Text>
                <Text style={styles.cvvText}>{cvv || "•••"}</Text>
              </View>
            </View>
            <View style={styles.backFooter}>
              <Text style={styles.backFooterText}>Banco | Blue Frut</Text>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Número de Tarjeta</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9010 1234"
          keyboardType="numeric"
          value={formatCardNumber(cardNumber)}
          onChangeText={handleCardNumberChange}
          maxLength={19} // incluye espacios
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>Titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Apellido"
              value={cardHolder}
              onChangeText={setCardHolder}
            />
          </View>

          <View style={{ width: 110 }}>
            <Text style={styles.inputLabel}>Vencimiento (MM/AA)</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              value={expiry}
              onChangeText={handleExpiryChange}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <View>
          <Text style={styles.inputLabel}>Código de seguridad (CVV)</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            keyboardType="numeric"
            value={cvv}
            onChangeText={handleCvvChange}
            maxLength={3}
            onFocus={flipToBack} // al focusear se gira
            onBlur={flipToFront} // al salir vuelve
            secureTextEntry={Platform.OS === "ios" ? false : false} // mostramos los números para que se vea en la tarjeta, opcional: true para ocultarlo
          />
          <Text style={styles.hint}>Al enfocarlo se muestra el reverso de la tarjeta.</Text>
        </View>

        <TouchableOpacity style={styles.nextWrap} onPress={() => alert("Procesando pago...")}>
          <LinearGradient colors={["#0d1640", "#000"]} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 8 },
  header: { alignItems: "center", paddingVertical: 10 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#0d0d25" },
  backButton: { marginBottom: 12 },
  backButtonText: { color: "#0d0d25", borderWidth: 1, borderColor: "#0d0d25", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    padding: 18,
    backgroundColor: "#0d2b64",
    justifyContent: "space-between",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#0b213d",
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoPlaceholder: { width: 70, height: 28, borderRadius: 6, backgroundColor: "#0b1830" },
  chip: { width: 48, height: 36, borderRadius: 6, backgroundColor: "#d9d9d9" },

  cardNumberText: { color: "#fff", fontSize: 20, letterSpacing: 2, marginTop: 8, fontWeight: "600" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  smallLabel: { color: "#bcd0ff", fontSize: 10 },
  footerText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  blackStrip: { height: 44, backgroundColor: "#000", marginTop: 12, borderRadius: 4 },
  signatureRow: { flexDirection: "row", marginTop: 12, alignItems: "center", paddingHorizontal: 6 },
  signatureBox: { flex: 1, height: 44, backgroundColor: "#fff", justifyContent: "center", paddingHorizontal: 8, borderRadius: 4 },
  signatureText: { fontSize: 12, color: "#333" },
  cvvBox: { width: 80, height: 44, marginLeft: 10, backgroundColor: "#fff", borderRadius: 4, justifyContent: "center", alignItems: "center" },
  cvvLabel: { fontSize: 10, color: "#888" },
  cvvText: { fontSize: 16, fontWeight: "700", color: "#000" },
  backFooter: { marginTop: 12 },
  backFooterText: { color: "#bcd0ff", fontSize: 12 },

  form: { marginTop: 20 },
  inputLabel: { fontSize: 13, marginBottom: 6, color: "#0d0d25", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: "#fff" },
  row: { flexDirection: "row", alignItems: "center" },
  hint: { fontSize: 12, color: "#777", marginBottom: 8 },

  nextWrap: { marginTop: 8 },
  nextButton: { borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
