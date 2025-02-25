import { LocationObject } from 'expo-location';

// Types for Google Maps API responses
export interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string; // address
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
  };
  price_level?: number;
  website?: string;
  formatted_phone_number?: string;
  formatted_address?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  distance?: number; // Added by our code, not from Google API
}

export interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  error_message?: string;
}

export interface GooglePlaceDetailsResponse {
  result: GooglePlace & {
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number;
    }>;
  };
  status: string;
  error_message?: string;
}

// Calculate distance between two coordinates in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Google Maps API service
export const googleMapsApi = {
  // Search for nearby boba shops
  async searchNearbyBobaShops(
    location: LocationObject,
    radius: number = 1500 // Default 1.5km radius
  ): Promise<GooglePlace[]> {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=cafe&keyword=boba|bubble tea&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data: GooglePlacesResponse = await response.json();

      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Google API error: ${data.status}`);
      }

      // Sort by distance
      return data.results
        .map(place => ({
          ...place,
          distance: calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            place.geometry.location.lat,
            place.geometry.location.lng
          )
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 5); // Get top 5 closest
    } catch (error) {
      console.error('Error fetching nearby boba shops:', error);
      throw error;
    }
  },

  // Get details for a specific place
  async getPlaceDetails(placeId: string): Promise<GooglePlace> {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,geometry,opening_hours,photos,rating,reviews,website,price_level,vicinity&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data: GooglePlaceDetailsResponse = await response.json();

      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Google API error: ${data.status}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  },

  // Get a photo URL for a place
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      throw new Error('Google Maps API key is not configured');
    }

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
  }
}; 