// ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductsList = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products') // ajusta URL a tu backend
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Ver Producto</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestros Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#f8f9fa', borderRadius: 10, padding: 10, marginBottom: 10, width: '48%' },
  image: { width: '100%', height: 120, resizeMode: 'contain' },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  button: { backgroundColor: '#1a1a3a', padding: 5, marginTop: 5, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ProductsList;
