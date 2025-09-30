// ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '../config.js';

const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productUrl = `${API_URL}/products/${id}`;
const allProductsUrl = `${API_URL}/products`;

    // Fetch producto actual
    fetch(productUrl)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error fetch product:', err));

    // Fetch todos los productos para preview
    fetch(allProductsUrl)
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p._id !== id))) // excluye el actual
      .catch(err => console.error('Error fetch all products:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#1a1a3a" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Producto no encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver a Productos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPreviewItem = ({ item }) => (
    <TouchableOpacity
      style={styles.previewCard}
      onPress={() => navigation.push('ProductDetail', { id: item._id })}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.previewImage} />
      <Text style={styles.previewName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver a Productos</Text>
      </TouchableOpacity>

      <Image 
        source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>
        ${product.price ? product.price.toFixed(2) : '0.00'}
      </Text>
      {product.flavor && <Text style={styles.flavor}>Sabor: {product.flavor}</Text>}
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyButton}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.qtyButton}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Comprar</Text>
      </TouchableOpacity>

      {/* Preview de otros productos */}
      <Text style={styles.previewTitle}>También te puede interesar</Text>
      <FlatList
        data={products}
        renderItem={renderPreviewItem}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  backButton: { marginBottom: 10, padding: 10, backgroundColor: '#1a1a3a', borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  image: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  flavor: { fontSize: 16, marginBottom: 10 },
  description: { fontSize: 14, color: '#666', marginBottom: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  qtyButton: { backgroundColor: '#f8f9fa', padding: 10, borderRadius: 5 },
  quantity: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
  buyButton: { backgroundColor: '#1a1a3a', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  previewList: { marginBottom: 20 },
  previewCard: { width: 100, marginRight: 10, alignItems: 'center' },
  previewImage: { width: 100, height: 100, resizeMode: 'contain', borderRadius: 8 },
  previewName: { fontSize: 12, textAlign: 'center', marginTop: 5 },
});

export default ProductDetail;
