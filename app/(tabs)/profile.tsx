import { ScrollView, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_COMMENTS = [
  {
    id: '1',
    shopName: 'Boba Guys',
    date: '2 days ago',
    comment: 'The strawberry matcha latte was amazing! Perfect sweetness level.',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800',
  },
  {
    id: '2',
    shopName: 'Tea Station',
    date: '1 week ago',
    comment: 'Tried their new taro milk tea with boba. The pearls were perfectly chewy!',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800',
  },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' }}
                style={styles.avatar}
              />
              <View style={styles.editAvatarButton}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </View>
            </View>
            <Text style={styles.name}>Sarah Chen</Text>
            <Text style={styles.bio}>Boba enthusiast | 🧋</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Comments</Text>
          {MOCK_COMMENTS.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Image source={{ uri: comment.image }} style={styles.shopImage} />
              <View style={styles.commentContent}>
                <Text style={styles.shopName}>{comment.shopName}</Text>
                <Text style={styles.commentText}>{comment.comment}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color="#666" />
          <Text style={styles.settingsButtonText}>Settings</Text>
        </Pressable>
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
    backgroundColor: '#FFF5F8',
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4785',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  commentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  settingsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});