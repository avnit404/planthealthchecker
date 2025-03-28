
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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
      <ThemedText type="title">Profile</ThemedText>

      <View style={styles.card}>
        <ThemedText type="subtitle">User Details</ThemedText>
        <ThemedText>Email: {user?.email}</ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText type="subtitle">Subscription</ThemedText>
        <ThemedText>Current Plan: Free</ThemedText>
      </View>

      <View style={[styles.card, styles.premiumCard]}>
        <ThemedText type="subtitle">Upgrade to Premium</ThemedText>
        <ThemedText>Get access to advanced features!</ThemedText>
        <TouchableOpacity style={styles.upgradeButton}>
          <ThemedText>Upgrade Now</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  premiumCard: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  upgradeButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});
