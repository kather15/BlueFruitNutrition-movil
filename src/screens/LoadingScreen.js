import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ onLoadingComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso para el logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Simular tiempo de carga (3 segundos)
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo con animaciones */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) }
            ],
          },
        ]}
      >
        <Image
          source={require('../../assets/logoBlueFrui.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Indicador de carga */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <ActivityIndicator size="large" color="#f6f6f7ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </Animated.View>

      {/* Versión */}
      <Animated.View style={[styles.versionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C133F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  taglineText: {
    fontSize: 16,
    color: '#B0C4DE',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
  },
  versionText: {
    color: '#B0C4DE',
    fontSize: 14,
    opacity: 0.7,
  },
});

export default LoadingScreen;