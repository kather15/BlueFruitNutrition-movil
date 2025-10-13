import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  ScrollView,
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config.js';

const { width } = Dimensions.get('window');

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

    fetch(productUrl)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error fetch product:', err));

    fetch(allProductsUrl)
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p._id !== id)))
      .catch(err => console.error('Error fetch all products:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C133F" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.backButtonEmpty} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver a Productos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPreviewItem = ({ item }) => (
    <TouchableOpacity
      style={styles.previewCard}
      onPress={() => navigation.push('ProductDetail', { id: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.previewImageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
          style={styles.previewImage} 
        />
      </View>
      <Text style={styles.previewName} numberOfLines={2}>{item.name}</Text>
      {item.price && (
        <Text style={styles.previewPrice}>${item.price.toFixed(2)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Botón flotante de volver */}
      <TouchableOpacity 
        style={styles.backButtonFloat} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#0C133F" />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagen del producto con fondo degradado */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
        </View>

        {/* Información del producto */}
        <View style={styles.contentSection}>
          {/* Nombre y sabor */}
          <View style={styles.titleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.flavor && (
              <View style={styles.flavorBadge}>
                <Text style={styles.flavorText}>{product.flavor}</Text>
              </View>
            )}
          </View>

          {/* Precio destacado */}
          <View style={styles.priceSection}>
            <Text style={styles.priceSymbol}>$</Text>
            <Text style={styles.productPrice}>
              {product.price ? product.price.toFixed(2) : '0.00'}
            </Text>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#0C133F" />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Selector de cantidad y botón de compra */}
          <View style={styles.actionSection}>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Cantidad</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  onPress={() => setQuantity(q => Math.max(1, q - 1))} 
                  style={styles.quantityBtn}
                >
                  <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => setQuantity(q => q + 1)} 
                  style={styles.quantityBtn}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.addToCartButton}>
              <View style={styles.buttonContent}>
                <Ionicons name="cart" size={22} color="#fff" />
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonLabel}>Agregar al carrito</Text>
                  <Text style={styles.buttonPrice}>
                    ${(product.price * quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Productos relacionados */}
          {products.length > 0 && (
            <View style={styles.relatedSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="star" size={20} color="#0C133F" />
                <Text style={styles.sectionTitle}>También te puede interesar</Text>
              </View>
              <FlatList
                data={products.slice(0, 6)}
                renderItem={renderPreviewItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedList}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 20,
  },
  backButtonEmpty: {
    backgroundColor: '#0C133F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Botón flotante
  backButtonFloat: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Sección de imagen
  imageSection: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  productImage: { 
    width: width - 100,
    height: 280,
  },
  
  // Contenido principal
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Título y sabor
  titleSection: {
    marginBottom: 16,
  },
  productName: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    lineHeight: 36,
  },
  flavorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  flavorText: {
    fontSize: 13,
    color: '#0C133F',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Precio
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C133F',
    marginRight: 4,
    marginBottom: 4,
  },
  productPrice: { 
    fontSize: 38, 
    fontWeight: 'bold',
    color: '#0C133F',
  },
  
  // Descripción
  descriptionSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  descriptionText: { 
    fontSize: 15, 
    color: '#4b5563',
    lineHeight: 24,
  },
  
  // Acción (cantidad y botón)
  actionSection: {
    marginBottom: 32,
  },
  quantityBox: {
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  quantityControls: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  quantityBtn: { 
    backgroundColor: '#0C133F',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: { 
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  
  // Botón agregar al carrito
  addToCartButton: { 
    backgroundColor: '#0C133F',
    borderRadius: 14,
    shadowColor: '#0C133F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonTextContainer: {
    marginLeft: 12,
  },
  buttonLabel: { 
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  buttonPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Productos relacionados
  relatedSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  relatedList: {
    paddingTop: 12,
  },
  previewCard: { 
    width: 140,
    marginRight: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewImageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  previewImage: { 
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  previewName: { 
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 6,
    height: 36,
  },
  previewPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C133F',
  },
});

export default ProductDetail;