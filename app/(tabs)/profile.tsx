
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.profileCard}
      >
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#fff" />
          <ThemedText style={styles.userName}>{user?.email || 'User'}</ThemedText>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.subscriptionCard}>
            <MaterialCommunityIcons name="star-circle" size={24} color="#FFD700" />
            <ThemedText style={styles.subscriptionTitle}>Free Plan</ThemedText>
            <ThemedText style={styles.subscriptionDetails}>Basic features included</ThemedText>
          </View>

          <TouchableOpacity style={styles.upgradeCard}>
            <MaterialCommunityIcons name="crown" size={30} color="#FFD700" />
            <View>
              <ThemedText style={styles.upgradeTitle}>Upgrade to Premium</ThemedText>
              <ThemedText style={styles.upgradeDetails}>Get access to all features</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 20,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadow: '0 0 10px rgba(255,255,255,0.3)',
  },
  infoSection: {
    gap: 20,
  },
  subscriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subscriptionDetails: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
  upgradeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  upgradeDetails: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
