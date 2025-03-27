
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { auth } from '../../config/firebase';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText>Email: {user?.email}</ThemedText>
      <ThemedText>User ID: {user?.uid}</ThemedText>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
