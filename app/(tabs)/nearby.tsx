import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { usePreferences } from '@/contexts/PreferencesContext';
import { googleMapsApi, GooglePlace } from '@/lib/api/googleMaps';

export default function NearbyScreen() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const mapRef = useRef<MapView>(null);
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyShops, setNearbyShops] = useState<GooglePlace[]>([]);
  const [selectedShop, setSelectedShop] = useState<GooglePlace | null>(null);

  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs access to your location to find nearby boba shops. Please enable location services.',
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Search for nearby boba shops
  const searchNearbyShops = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your location. Please try again.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const shops = await googleMapsApi.searchNearbyBobaShops(location);
      setNearbyShops(shops);
      
      // Fit map to show all markers
      if (shops.length > 0 && mapRef.current) {
        const coordinates = shops.map(shop => ({
          latitude: shop.geometry.location.lat,
          longitude: shop.geometry.location.lng,
        }));
        
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error searching for nearby shops:', error);
      setErrorMsg('Failed to find nearby boba shops. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marker press
  const handleMarkerPress = (shop: GooglePlace) => {
    setSelectedShop(shop);
    
    // Center map on selected shop
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: shop.geometry.location.lat,
        longitude: shop.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Navigate to shop details
  const navigateToShopDetails = (shop: GooglePlace) => {
    router.push({
      pathname: '/shop/[id]',
      params: { id: shop.place_id, name: shop.name }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Boba</Text>
        <Text style={styles.subtitle}>Find boba shops near you</Text>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* User location marker */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="#4285F4"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
              </View>
            </Marker>

            {/* Shop markers */}
            {nearbyShops.map((shop) => (
              <Marker
                key={shop.place_id}
                coordinate={{
                  latitude: shop.geometry.location.lat,
                  longitude: shop.geometry.location.lng,
                }}
                title={shop.name}
                description={shop.vicinity}
                onPress={() => handleMarkerPress(shop)}
              >
                <View style={styles.shopMarker}>
                  <Ionicons name="cafe" size={18} color="#FFF" />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
              <>
                <ActivityIndicator size="large" color="#FF4785" />
                <Text style={styles.loadingText}>Getting your location...</Text>
              </>
            )}
          </View>
        )}
      </View>

      {/* Search Button */}
      <View style={styles.searchButtonContainer}>
        <Pressable
          style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
          onPress={searchNearbyShops}
          disabled={isLoading || !location}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="search" size={20} color="#FFF" style={styles.searchIcon} />
              <Text style={styles.searchButtonText}>Find Nearby Boba Shops</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Shop List */}
      {nearbyShops.length > 0 && (
        <View style={styles.shopListContainer}>
          <FlatList
            data={nearbyShops}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.shopCard,
                  selectedShop?.place_id === item.place_id && styles.selectedShopCard,
                ]}
                onPress={() => handleMarkerPress(item)}
              >
                <View style={styles.shopCardContent}>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <Text style={styles.shopAddress}>{item.vicinity}</Text>
                  <Text style={styles.shopDistance}>
                    {item.distance ? `${item.distance.toFixed(1)} km away` : 'Nearby'}
                  </Text>
                  
                  <Pressable
                    style={styles.detailsButton}
                    onPress={() => navigateToShopDetails(item)}
                  >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF5F8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4785',
    textAlign: 'center',
    padding: 20,
  },
  searchButtonContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  searchButton: {
    backgroundColor: '#FF4785',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  searchButtonDisabled: {
    backgroundColor: '#FFB4C8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shopListContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  shopCard: {
    width: 250,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedShopCard: {
    borderColor: '#FF4785',
  },
  shopCardContent: {
    padding: 16,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  shopDistance: {
    fontSize: 14,
    color: '#FF4785',
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    borderWidth: 2,
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
  shopMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF4785',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});