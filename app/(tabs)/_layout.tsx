
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
          },
          default: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
          },
        }),
      }}>
      <Tabs.Screen
        name="plant-identification"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="leaf" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-check"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
