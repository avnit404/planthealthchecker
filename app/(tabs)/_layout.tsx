import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import HapticTab from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

const { width } = Dimensions.get("window");

const AnimatedTabIcon = ({ name, focused, color, size }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Animate scale based on focus
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
  }, [focused]);

  // Animated style: raise icon when focused
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    marginTop: focused ? -10 : 0, // raise the selected icon upward
  }));

  return (
    // If focused, wrap the icon in a white circular container
    <Animated.View style={[animatedStyle, focused && styles.selectedIconContainer]}>
      <MaterialCommunityIcons 
        name={name} 
        size={size} 
        color={focused ? "#fff" : color} // focused icon becomes forest green; otherwise, default color is used
      />
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tint colors (for fallback; our AnimatedTabIcon overrides the focused state)
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#945034",
            borderTopWidth: 0,
            elevation: 0,
            height: 70,
            borderRadius: 25,
            marginHorizontal: 16,
            marginBottom: 20,
            paddingBottom: 10,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          default: {
            backgroundColor: "#228B22",
            borderTopWidth: 0,
            elevation: 3,
            height: 60,
            padding: 10,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="plant-identification"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon name="leaf" focused={focused} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon name="medical-bag" focused={focused} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon name="account" focused={focused} color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Style applied only when the tab is focused
  selectedIconContainer: {
    backgroundColor: "#945034", // white circular background for selected icon
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    // Optional shadow for a lifted effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
