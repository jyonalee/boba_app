import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { googleMapsApi, GooglePlace } from '@/lib/api/googleMaps';
import { perplexityApi } from '@/lib/api/perplexity';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function ShopDetailsScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const { preferences } = usePreferences();

  const [shop, setShop] = useState<GooglePlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shopSummary, setShopSummary] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Shop ID is missing');
      setIsLoading(false);
      return;
    }

    const loadShopDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch shop details from Google Maps API
        const shopDetails = await googleMapsApi.getPlaceDetails(id as string);
        setShop(shopDetails);

        // Get shop summary from Perplexity API
        const summary = await perplexityApi.getShopSummary(shopDetails);
        setShopSummary(summary);

        // Get review summary from Perplexity API
        const reviews = await perplexityApi.getReviewSummary(
          shopDetails,
          shopDetails.reviews
        );
        setReviewSummary(reviews);
      } catch (err) {
        console.error('Error loading shop details:', err);
        setError('Failed to load shop details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadShopDetails();
  }, [id]);

  const openMaps = () => {
    if (!shop) return;

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${shop.geometry.location.lat},${shop.geometry.location.lng}`;
    const label = shop.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      web: `https://www.google.com/maps/search/?api=1&query=${latLng}&query_place_id=${shop.place_id}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const openWebsite = () => {
    if (shop?.website) {
      Linking.openURL(shop.website);
    }
  };

  const callShop = () => {
    if (shop?.formatted_phone_number) {
      Linking.openURL(`tel:${shop.formatted_phone_number}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4785" />
        <Text style={styles.loadingText}>Loading shop details...</Text>
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF4785" />
        <Text style={styles.errorText}>{error || 'Shop not found'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          {shop.photos && shop.photos.length > 0 ? (
            <Image
              source={{
                uri: googleMapsApi.getPhotoUrl(shop.photos[0].photo_reference),
              }}
              style={styles.headerImage}
            />
          ) : (
            <View style={[styles.headerImage, styles.noImage]}>
              <Ionicons name="cafe" size={48} color="#FFF" />
            </View>
          )}
          <BlurView intensity={80} style={styles.headerOverlay}>
            <Pressable style={styles.backIcon} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </Pressable>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{shop.rating}</Text>
                <Text style={styles.reviews}>
                  ({shop.user_ratings_total || 0} reviews)
                </Text>
              </View>
            )}
          </BlurView>
        </View>

        {/* Shop Info */}
        <View style={styles.infoContainer}>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <Text style={styles.address}>{shop.vicinity}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable style={styles.actionButton} onPress={openMaps}>
              <Ionicons name="navigate" size={20} color="#FF4785" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </Pressable>

            {shop.website && (
              <Pressable style={styles.actionButton} onPress={openWebsite}>
                <Ionicons name="globe" size={20} color="#FF4785" />
                <Text style={styles.actionButtonText}>Website</Text>
              </Pressable>
            )}

            {shop.formatted_phone_number && (
              <Pressable style={styles.actionButton} onPress={callShop}>
                <Ionicons name="call" size={20} color="#FF4785" />
                <Text style={styles.actionButtonText}>Call</Text>
              </Pressable>
            )}
          </View>

          {/* Shop Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            {shopSummary ? (
              <Text style={styles.sectionText}>{shopSummary}</Text>
            ) : (
              <View style={styles.loadingSection}>
                <ActivityIndicator size="small" color="#FF4785" />
                <Text style={styles.loadingText}>Loading summary...</Text>
              </View>
            )}
          </View>

          {/* Review Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What People Say</Text>
            {reviewSummary ? (
              <Text style={styles.sectionText}>{reviewSummary}</Text>
            ) : (
              <View style={styles.loadingSection}>
                <ActivityIndicator size="small" color="#FF4785" />
                <Text style={styles.loadingText}>Loading reviews...</Text>
              </View>
            )}
          </View>

          {/* Preference Match */}
          {preferences && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Preferences</Text>
              <View style={styles.preferencesContainer}>
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Sweetness:</Text>
                  <Text style={styles.preferenceValue}>
                    {preferences.sweetness_level}
                  </Text>
                </View>
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Favorite Toppings:</Text>
                  <Text style={styles.preferenceValue}>
                    {preferences.toppings.join(', ')}
                  </Text>
                </View>
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Tea Bases:</Text>
                  <Text style={styles.preferenceValue}>
                    {preferences.tea_bases.join(', ')}
                  </Text>
                </View>
                {preferences.lactose_free && (
                  <View style={styles.preferenceTag}>
                    <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                    <Text style={styles.preferenceTagText}>Lactose Free</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FF4785',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    backgroundColor: '#FF4785',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reviews: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    padding: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferencesContainer: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  preferenceItem: {
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 16,
    color: '#333',
  },
  preferenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4785',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  preferenceTagText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 