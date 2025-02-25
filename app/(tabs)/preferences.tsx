import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences, UserPreferences } from '@/contexts/PreferencesContext';

const SWEETNESS_LEVELS = ['Extra Sweet', 'Regular', 'Less Sweet', 'Half Sweet', 'Little Sweet'];
const TOPPINGS = ['Boba', 'Pudding', 'Aloe Vera', 'Red Bean', 'Grass Jelly', 'Lychee Jelly'];
const TEA_BASES = ['Black Tea', 'Green Tea', 'Oolong Tea', 'Thai Tea', 'Taro'];

export default function PreferencesScreen() {
  const { preferences, isLoading, savePreferences, error } = usePreferences();
  
  // Local state for form values
  const [sweetnessPreference, setSweetnessPreference] = useState('Regular');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Boba']);
  const [selectedBases, setSelectedBases] = useState<string[]>(['Black Tea']);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences from context
  useEffect(() => {
    if (preferences) {
      setSweetnessPreference(preferences.sweetness_level);
      setSelectedToppings(preferences.toppings);
      setSelectedBases(preferences.tea_bases);
      setLactoseFree(preferences.lactose_free);
    }
  }, [preferences]);

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const toggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toggleBase = (base: string) => {
    if (selectedBases.includes(base)) {
      setSelectedBases(selectedBases.filter((b) => b !== base));
    } else {
      setSelectedBases([...selectedBases, base]);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const newPreferences: UserPreferences = {
        sweetness_level: sweetnessPreference,
        toppings: selectedToppings,
        tea_bases: selectedBases,
        lactose_free: lactoseFree,
      };
      
      await savePreferences(newPreferences);
      Alert.alert('Success', 'Your preferences have been saved!');
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4785" />
        <Text style={styles.loadingText}>Loading your preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Preferences</Text>
          <Text style={styles.subtitle}>Customize your boba experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sweetness Level</Text>
          <View style={styles.optionsContainer}>
            {SWEETNESS_LEVELS.map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.option,
                  sweetnessPreference === level && styles.selectedOption,
                ]}
                onPress={() => setSweetnessPreference(level)}>
                <Text
                  style={[
                    styles.optionText,
                    sweetnessPreference === level && styles.selectedOptionText,
                  ]}>
                  {level}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Toppings</Text>
          <View style={styles.optionsContainer}>
            {TOPPINGS.map((topping) => (
              <Pressable
                key={topping}
                style={[
                  styles.option,
                  selectedToppings.includes(topping) && styles.selectedOption,
                ]}
                onPress={() => toggleTopping(topping)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedToppings.includes(topping) && styles.selectedOptionText,
                  ]}>
                  {topping}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Tea Bases</Text>
          <View style={styles.optionsContainer}>
            {TEA_BASES.map((base) => (
              <Pressable
                key={base}
                style={[
                  styles.option,
                  selectedBases.includes(base) && styles.selectedOption,
                ]}
                onPress={() => toggleBase(base)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedBases.includes(base) && styles.selectedOptionText,
                  ]}>
                  {base}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Lactose Free Options</Text>
              <Text style={styles.settingDescription}>
                Only show drinks that are lactose-free
              </Text>
            </View>
            <Switch
              value={lactoseFree}
              onValueChange={setLactoseFree}
              trackColor={{ false: '#DDD', true: '#FF4785' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.saveButton}
            onPress={handleSavePreferences}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Preferences</Text>
            )}
          </Pressable>
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  option: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedOption: {
    backgroundColor: '#FF4785',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#FF4785',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});