// ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config.js';

const { width } = Dimensions.get('window'); // ancho de la pantalla
const CARD_WIDTH = (width / 2) - 25; // tamaño dinámico para que siempre se vea bien

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
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver Producto</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1a1a3a" />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No hay productos disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestros Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 15, 
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#0B1541', 
    textAlign: 'center' 
  },
  card: { 
    width: CARD_WIDTH,
    backgroundColor: '#f8f9fa', 
    borderRadius: 15, 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: { 
    width: '100%', 
    height: 140, 
    resizeMode: 'contain',
    borderRadius: 10,
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 10, 
    textAlign: 'center',
    color: '#333'
  },
  button: { 
    backgroundColor: '#0B1541', 
    paddingVertical: 10, 
    marginTop: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});

export default ProductsList;
