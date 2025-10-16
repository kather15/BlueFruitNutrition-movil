import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../config.js';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width / 2) - 25;

const ProductsList = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        console.log('Productos recibidos:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener productos:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        
        {item.price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceSymbol}>$</Text>
            <Text style={styles.price}>{item.price.toFixed(2)}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
        >
          <Text style={styles.buttonText}>Ver más</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#0C133F" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={80} color="#d1d5db" />
        <Text style={styles.emptyTitle}>No hay productos</Text>
        <Text style={styles.emptyText}>No hay productos disponibles en este momento</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0C133F', '#1a2456']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerSubtitle}></Text>
            <Text style={styles.headerTitle}>Nuestros Productos</Text>
          </View>
          
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text style={styles.statLabel}> Calidad Garantizada</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f2f4f8',
  },

  // Header Styles
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#0C133F',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },

  // List Styles
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: 'space-between',
  },

  // Card Styles
  card: { 
    width: CARD_WIDTH,
    backgroundColor: '#ffffff', 
    borderRadius: 18, 
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  image: { 
    width: '100%', 
    height: 140, 
    resizeMode: 'contain',
    borderRadius: 12,
  },
  cardContent: {
    padding: 14,
  },
  name: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#111827',
    marginBottom: 8,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  priceSymbol: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0C133F',
    marginRight: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0C133F',
  },
  button: { 
    backgroundColor: '#0C133F', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#0C133F',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 14,
    marginRight: 5,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ProductsList;