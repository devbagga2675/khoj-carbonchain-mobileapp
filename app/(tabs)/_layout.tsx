import { View, Image, ImageBackground } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images"; // Ensure you have a highlighted bg or remove this

const TabIcon = ({ icon, focused }: any) => {
  // Simplified icon for now
  return (
    <View className={`items-center justify-center ${focused ? 'bg-white/10 rounded-full p-2' : ''}`}>
      <Image 
        source={icon} 
        tintColor={focused ? "#ffffff" : "#A8B5DB"} 
        className="size-6" 
        resizeMode="contain"
      />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0f0d23',
          borderTopWidth: 0,
          height: 60,
          elevation: 0,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={icons.home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={icons.person} focused={focused} />,
        }}
      />
    </Tabs>
  );
}