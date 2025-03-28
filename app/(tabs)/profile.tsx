
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
          <MaterialCommunityIcons name="account-circle" size={80} color="#4CAF50" />
          <ThemedText style={styles.userName}>{user?.email || 'User'}</ThemedText>
        </View>

        <View style={styles.infoSection}>
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.subscriptionCard}
          >
            <MaterialCommunityIcons name="star-circle" size={24} color="#4CAF50" />
            <ThemedText style={styles.subscriptionTitle}>Free Plan</ThemedText>
            <ThemedText style={styles.subscriptionDetails}>Basic features included</ThemedText>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.upgradeCard}
          >
            <MaterialCommunityIcons name="crown" size={30} color="#4CAF50" />
            <View>
              <ThemedText style={styles.upgradeTitle}>Upgrade to Premium</ThemedText>
              <ThemedText style={styles.upgradeDetails}>Get access to all features</ThemedText>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
          >
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialCommunityIcons name="logout" size={24} color="#f44336" />
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFDDAB',
  },
  profileCard: {
    backgroundColor: '#27391C',
    borderRadius: 25,
    padding: 20,
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoSection: {
    gap: 20,
  },
  subscriptionCard: {
    backgroundColor: '#A08963',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subscriptionDetails: {
    opacity: 0.7,
    marginTop: 5,
  },
  upgradeCard: {
    backgroundColor: '#A08963',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  upgradeDetails: {
    opacity: 0.7,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#7D0A0A',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
  }
});
