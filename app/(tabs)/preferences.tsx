import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SWEETNESS_LEVELS = ['Extra Sweet', 'Regular', 'Less Sweet', 'Half Sweet', 'Little Sweet'];
const TOPPINGS = ['Boba', 'Pudding', 'Aloe Vera', 'Red Bean', 'Grass Jelly', 'Lychee Jelly'];
const TEA_BASES = ['Black Tea', 'Green Tea', 'Oolong Tea', 'Thai Tea', 'Taro'];

export default function PreferencesScreen() {
  const [sweetnessPreference, setSweetnessPreference] = useState('Regular');
  const [selectedToppings, setSelectedToppings] = useState(['Boba']);
  const [selectedBases, setSelectedBases] = useState(['Black Tea']);
  const [lactoseFree, setLactoseFree] = useState(false);

  const toggleTopping = (topping) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toggleBase = (base) => {
    if (selectedBases.includes(base)) {
      setSelectedBases(selectedBases.filter((b) => b !== base));
    } else {
      setSelectedBases([...selectedBases, base]);
    }
  };

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
});