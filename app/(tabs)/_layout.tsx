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
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    marginTop: focused ? -10 : 0,
  }));

  return (
    <Animated.View style={[animatedStyle, focused && styles.selectedIconContainer]}>
      <MaterialCommunityIcons 
        name={name} 
        size={size} 
        color={focused ? "#fff" : color} 
      />
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.7)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#228B22",
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            borderRadius: 20,
            marginHorizontal: 10,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
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
  selectedIconContainer: {
    backgroundColor: "#945034",
    width: Platform.select({ android: 48, default: 50 }),
    height: Platform.select({ android: 48, default: 50 }),
    borderRadius: Platform.select({ android: 24, default: 25 }),
    justifyContent: "center",
    alignItems: "center",
    elevation: Platform.select({ android: 6, default: 0 }),
    shadowColor: Platform.select({ android: 'transparent', default: "#000" }),
    shadowOffset: Platform.select({ 
      android: undefined,
      default: { width: 0, height: 2 } 
    }),
    shadowOpacity: Platform.select({ android: 0, default: 0.3 }),
    shadowRadius: Platform.select({ android: 0, default: 3 }),
  },
});