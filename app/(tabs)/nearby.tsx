import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const MOCK_NEARBY_SHOPS = [
  {
    id: '1',
    name: 'Boba Guys',
    distance: '0.3',
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800',
    address: '123 Main St, San Francisco, CA',
  },
  {
    id: '2',
    name: 'Tea Station',
    distance: '0.5',
    rating: 4.6,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800',
    address: '456 Market St, San Francisco, CA',
  },
];

export default function NearbyScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setErrorMsg('Location services are not available in web browser');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Nearby Boba</Text>
          <Text style={styles.subtitle}>
            {errorMsg ? errorMsg : 'Showing boba shops near you'}
          </Text>
        </View>

        {MOCK_NEARBY_SHOPS.map((shop) => (
          <Link key={shop.id} href={`/shop/${shop.id}`} asChild>
            <Pressable style={styles.shopCard}>
              <Image source={{ uri: shop.image }} style={styles.shopImage} />
              <BlurView intensity={80} style={styles.shopInfo}>
                <View style={styles.shopHeader}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location" size={14} color="#FFF" />
                    <Text style={styles.distance}>{shop.distance} mi</Text>
                  </View>
                </View>
                <Text style={styles.address}>{shop.address}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{shop.rating}</Text>
                  <Text style={styles.reviews}>({shop.reviews} reviews)</Text>
                </View>
              </BlurView>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
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
  shopCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  shopInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviews: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 14,
  },
});