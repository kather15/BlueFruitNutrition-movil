import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(340, width - 60);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.60);

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

  const flipToBack = () => {
    Animated.timing(animatedValue, {
      toValue: 180,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setFlipped(true));
  };

  const flipToFront = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setFlipped(false));
  };

  // Formatear número de tarjeta
  const formatCardNumber = (digits) => {
    if (!digits) return "1234  5678  9010\n1234";
    const formatted = digits.replace(/\s?/g, "");
    const line1 = formatted.slice(0, 12).replace(/(\d{4})/g, "$1  ").trim();
    const line2 = formatted.slice(12, 16);
    return line1 + (line2 ? "\n" + line2 : "");
  };

  // Validar solo números para tarjeta
  const handleCardNumberChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits);
  };

  // Validar solo letras para titular
  const handleCardHolderChange = (text) => {
    const letters = text.replace(/[^a-zA-Z\s]/g, "");
    setCardHolder(letters);
  };

  // Validar fecha de expiración
  const handleExpiryChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  };

  // Validar CVV (solo números)
  const handleCvvChange = (text) => {
    const digits = text.replace(/\D/g, "").slice(0, 3);
    setCvv(digits);
  };

  const handlePayment = () => {
    if (!cardNumber || cardNumber.length < 16) {
      alert("Por favor ingresa un número de tarjeta válido (16 dígitos)");
      return;
    }
    if (!cardHolder) {
      alert("Por favor ingresa el nombre del titular");
      return;
    }
    if (!expiry || expiry.length < 5) {
      alert("Por favor ingresa la fecha de vencimiento (MM/AA)");
      return;
    }
    if (!cvv || cvv.length < 3) {
      alert("Por favor ingresa el CVV (3 dígitos)");
      return;
    }
    
    navigation.navigate('Bill');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons name="arrow-back" size={24} color="#0C133F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Método de Pago</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instrucción */}
        <View style={styles.instructionCard}>
          <Ionicons name="shield-checkmark" size={24} color="#10b981" />
          <Text style={styles.instructionText}>
            Pago seguro y encriptado
          </Text>
        </View>

        {/* Tarjeta Minimalista */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => {}} 
          style={styles.cardContainer}
        >
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
              <View style={styles.cardWhite}>
                <View style={styles.cardContent}>
                  {/* Chip */}
                  <View style={styles.chipContainer}>
                    <View style={styles.chip}>
                      <View style={styles.chipInner} />
                    </View>
                  </View>

                  {/* Número de Tarjeta */}
                  <Text style={styles.cardNumberText}>
                    {formatCardNumber(cardNumber)}
                  </Text>

                  {/* Footer con titular y vencimiento */}
                  <View style={styles.cardFooter}>
                    <View style={styles.cardFooterLeft}>
                      <Text style={styles.smallLabel}>TITULAR</Text>
                      <Text style={styles.footerText} numberOfLines={1}>
                        {cardHolder || "Nombre Apellido"}
                      </Text>
                    </View>
                    <View style={styles.cardFooterRight}>
                      <Text style={styles.smallLabel}>VENCIMIENTO</Text>
                      <Text style={styles.footerText}>{expiry || "MM/AA"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* BACK */}
            <Animated.View
              style={[
                styles.card,
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                },
              ]}
            >
              <View style={styles.cardBack}>
                <View style={styles.blackStrip} />
                
                <View style={styles.backContent}>
                  <View style={styles.signatureSection}>
                    <Text style={styles.backLabel}>Titular</Text>
                    <View style={styles.signatureBox}>
                      <Text style={styles.signatureText}>
                        {cardHolder || "Ejemplo"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cvvSection}>
                    <Text style={styles.backLabel}>Código</Text>
                    <View style={styles.cvvBox}>
                      <Text style={styles.cvvTextBack}>{cvv || "•••"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Datos de la Tarjeta</Text>

          {/* Número de Tarjeta */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="card-outline" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Número de Tarjeta</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
              onChangeText={handleCardNumberChange}
              maxLength={19}
            />
            <Text style={styles.helperText}>
              {cardNumber.length}/16 dígitos
            </Text>
          </View>

          {/* Titular */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="person-outline" size={18} color="#0C133F" />
              <Text style={styles.inputLabel}>Nombre del Titular</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nombre Apellido"
              placeholderTextColor="#9ca3af"
              value={cardHolder}
              onChangeText={handleCardHolderChange}
            />
            <Text style={styles.helperText}>
              Como aparece en la tarjeta
            </Text>
          </View>

          {/* Expiry y CVV en fila */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <View style={styles.labelRow}>
                <Ionicons name="calendar-outline" size={18} color="#0C133F" />
                <Text style={styles.inputLabel}>Vencimiento</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor="#9ca3af"
                value={expiry}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <View style={styles.labelRow}>
                <Ionicons name="lock-closed-outline" size={18} color="#0C133F" />
                <Text style={styles.inputLabel}>CVV</Text>
                <TouchableOpacity onPress={flipToBack}>
                  <Ionicons name="help-circle-outline" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={cvv}
                onChangeText={handleCvvChange}
                maxLength={3}
                onFocus={flipToBack}
                onBlur={flipToFront}
                secureTextEntry
              />
            </View>
          </View>

          {/* Info de seguridad */}
          <View style={styles.securityCard}>
            <Ionicons name="lock-closed" size={20} color="#10b981" />
            <Text style={styles.securityCardText}>
              Tu información está protegida con encriptación de nivel bancario
            </Text>
          </View>

          {/* Botón de Pagar */}
          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePayment}
          >
            <View style={styles.payButtonGradient}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
              <Text style={styles.payButtonText}>Confirmar Pago</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: '#0C133F',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#274175ff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3f5f8ff',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Instruction Card
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  instructionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#15803d',
    fontWeight: '600',
  },

  // Card Container
  cardContainer: {
    alignSelf: "center",
    marginVertical: 30,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    backfaceVisibility: "hidden",
    overflow: 'hidden',
  },

  // Card Front - Minimalista Blanca
  cardWhite: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  chipContainer: {
    width: 50,
    height: 40,
  },
  chip: { 
    width: 50, 
    height: 40, 
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    padding: 3,
  },
  chipInner: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  cardNumberText: { 
    color: "#1f2937", 
    fontSize: 22, 
    letterSpacing: 2, 
    fontWeight: "500",
    lineHeight: 32,
    marginTop: 10,
  },
  cardFooter: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: 'flex-end',
  },
  cardFooterLeft: {
    flex: 1,
  },
  cardFooterRight: {
    alignItems: 'flex-end',
  },
  smallLabel: { 
    color: "#9ca3af", 
    fontSize: 9,
    marginBottom: 4,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  footerText: { 
    color: "#1f2937", 
    fontSize: 13, 
    fontWeight: "600",
  },

  // Card Back - Minimalista
  cardBack: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  blackStrip: { 
    height: 50, 
    backgroundColor: "#1f2937", 
    marginTop: 25,
  },
  backContent: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },
  signatureSection: {
    marginBottom: 16,
  },
  backLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signatureBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    height: 40,
    justifyContent: 'center',
  },
  signatureText: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  cvvSection: {
    marginTop: 8,
  },
  cvvBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cvvTextBack: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 3,
  },

  // Form
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
    flex: 1,
  },
  input: { 
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: "#e5e7eb", 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16,
    color: '#1f2937',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginLeft: 4,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "flex-start" 
  },

  // Security Card
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  securityCardText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    marginLeft: 10,
  },

  // Pay Button
  payButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0C133F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  payButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#0C133F',
    gap: 10,
  },
  payButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700",
    marginLeft: 8,
  },
});