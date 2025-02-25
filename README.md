# Boba Discovery App

A mobile application for discovering and exploring boba tea shops based on your preferences.

## Features

- User authentication with Supabase
- Personalized boba preferences
- Location-based boba shop discovery
- Interactive map interface
- AI-powered shop summaries and review analysis
- Detailed shop information

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for authentication and database
- Google Maps API for location and shop data
- Perplexity API for AI-powered summaries

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI
- Supabase account
- Google Maps API key
- Perplexity API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd boba-discovery-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     EXPO_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_api_key
     ```

### API Keys Setup

#### Google Maps API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create an API key with appropriate restrictions
5. Add the API key to your `.env` file

#### Perplexity API

1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to the API section
4. Generate an API key
5. Add the API key to your `.env` file

### Supabase Setup

1. Create a new Supabase project
2. Run the migration scripts in the `supabase/migrations` directory
3. Add your Supabase URL and anon key to the `.env` file

### Running the App

```
npx expo start
```

## Database Schema

The app uses the following tables:

- `profiles`: User profile information
- `preferences`: User boba preferences

## License

MIT 