// ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ProductDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  flavor: { fontSize: 16, marginBottom: 10 },
  description: { fontSize: 14, color: '#666', marginBottom: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  qtyButton: { backgroundColor: '#f8f9fa', padding: 10, borderRadius: 5 },
  quantity: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
  buyButton: { backgroundColor: '#1a1a3a', padding: 15, borderRadius: 10, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ProductDetail;
