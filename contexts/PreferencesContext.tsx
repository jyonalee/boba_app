import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Session } from '@supabase/supabase-js';

export interface UserPreferences {
  sweetness_level: string;
  toppings: string[];
  tea_bases: string[];
  lactose_free: boolean;
}

interface PreferencesContextType {
  preferences: UserPreferences | null;
  isLoading: boolean;
  savePreferences: (preferences: UserPreferences) => Promise<void>;
  error: string | null;
}

const defaultPreferences: UserPreferences = {
  sweetness_level: 'Regular',
  toppings: ['Boba'],
  tea_bases: ['Black Tea'],
  lactose_free: false,
};

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: null,
  isLoading: true,
  savePreferences: async () => {},
  error: null,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Update current session when session changes
  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  // Load preferences when user logs in
  useEffect(() => {
    if (!currentSession) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }

    async function loadPreferences() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .single();

        if (error) {
          // If no record found, create default preferences
          if (error.code === 'PGRST116') {
            await savePreferencesToSupabase(defaultPreferences);
            setPreferences(defaultPreferences);
          } else {
            console.error('Error loading preferences:', error);
            setError('Failed to load preferences');
          }
        } else if (data) {
          setPreferences(data);
        }
      } catch (err) {
        console.error('Error in loadPreferences:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [currentSession]);

  // Save preferences to Supabase
  const savePreferencesToSupabase = async (newPreferences: UserPreferences) => {
    if (!currentSession) {
      setError('You must be logged in to save preferences');
      return;
    }

    try {
      const { error } = await supabase
        .from('preferences')
        .upsert({
          user_id: currentSession.user.id,
          ...newPreferences,
        });

      if (error) {
        console.error('Error saving preferences:', error);
        setError('Failed to save preferences');
        throw error;
      }
    } catch (err) {
      console.error('Error in savePreferencesToSupabase:', err);
      setError('An unexpected error occurred');
      throw err;
    }
  };

  // Public method to save preferences
  const savePreferences = async (newPreferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);

    try {
      await savePreferencesToSupabase(newPreferences);
      setPreferences(newPreferences);
    } catch (err) {
      // Error already handled in savePreferencesToSupabase
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        savePreferences,
        error,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => useContext(PreferencesContext); 