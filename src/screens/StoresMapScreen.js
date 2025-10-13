import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const StoresMapScreen = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 13.7028,
    longitude: -89.2073,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://bluefruitnutrition-production.up.railway.app/api/location'
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStores(data);

      // Centrar en la primera tienda si hay datos
      if (data.length > 0) {
        setRegion({
          latitude: data[0].lat,
          longitude: data[0].lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        setSelectedStore(data[0]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      Alert.alert('Error', 'No se pudieron cargar las tiendas');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (store) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${store.lat},${store.lng}`;
    const label = store.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    });
  };

  const getDirections = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  const callStore = (phone) => {
    if (phone && phone !== 'Contactar tienda') {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
    setRegion({
      latitude: store.lat,
      longitude: store.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0C133F" />
        <Text style={styles.loadingText}>Cargando tiendas...</Text>
      </View>
    );
  }

  if (stores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="location-outline" size={80} color="#d1d5db" />
        <Text style={styles.emptyTitle}>No hay tiendas disponibles</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStores}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Encuentra una tienda</Text>
          <Text style={styles.headerSubtitle}>
            {stores.length} {stores.length === 1 ? 'tienda disponible' : 'tiendas disponibles'}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchStores}>
          <Ionicons name="refresh" size={24} color="#0C133F" />
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {stores.map((store, index) => (
          <Marker
            key={store._id || index}
            coordinate={{
              latitude: store.lat,
              longitude: store.lng,
            }}
            title={store.name}
            description={store.address}
            onPress={() => handleMarkerPress(store)}
            pinColor={selectedStore?._id === store._id ? '#0C133F' : '#ef4444'}
          />
        ))}
      </MapView>

      {/* Lista de tiendas */}
      <View style={styles.storesListContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storesList}
        >
          {stores.map((store, index) => (
            <TouchableOpacity
              key={store._id || index}
              style={[
                styles.storeCard,
                selectedStore?._id === store._id && styles.storeCardActive,
              ]}
              onPress={() => handleMarkerPress(store)}
            >
              <View style={styles.storeNumber}>
                <Text style={styles.storeNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {store.name}
                </Text>

                <View style={styles.storeDetail}>
                  <Ionicons name="location" size={14} color="#6b7280" />
                  <Text style={styles.storeDetailText} numberOfLines={1}>
                    {store.address}
                  </Text>
                </View>

                <View style={styles.storeDetail}>
                  <Ionicons name="time" size={14} color="#6b7280" />
                  <Text style={styles.storeDetailText} numberOfLines={1}>
                    {store.openingHours || 'Consultar horario'}
                  </Text>
                </View>

                {store.phone && (
                  <View style={styles.storeDetail}>
                    <Ionicons name="call" size={14} color="#6b7280" />
                    <Text style={styles.storeDetailText} numberOfLines={1}>
                      {store.phone}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.storeActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openInMaps(store)}
                >
                  <Ionicons name="map" size={18} color="#0C133F" />
                  <Text style={styles.actionButtonText}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => getDirections(store)}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    Ir
                  </Text>
                </TouchableOpacity>

                {store.phone && store.phone !== 'Contactar tienda' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => callStore(store.phone)}
                  >
                    <Ionicons name="call" size={18} color="#10b981" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#0C133F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C133F',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
  },
  storesListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  storesList: {
    paddingHorizontal: 15,
  },
  storeCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storeCardActive: {
    borderColor: '#0C133F',
  },
  storeNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0C133F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  storeNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  storeInfo: {
    marginBottom: 12,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  storeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeDetailText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
    flex: 1,
  },
  storeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonPrimary: {
    backgroundColor: '#0C133F',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0C133F',
    marginLeft: 4,
  },
});

export default StoresMapScreen;