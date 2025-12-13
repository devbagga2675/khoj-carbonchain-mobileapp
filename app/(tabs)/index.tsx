import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// Ideally, this image would be imported locally or via URI.
// Using a placeholder based on your context.
const EARTH_IMAGE = require("../../assets/earth.png"); // Ensure you have this path or replace it

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  // Floating dot animation
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const dotTranslate = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  return (
    <View className="flex-1 bg-[#040d07] px-5 pt-12">
      {/* GREEN BACKGROUND BLOBS */}
      {/* Top Blob */}
      <LinearGradient
        colors={["rgba(34,197,94,0.35)", "transparent"]}
        className="absolute w-[300px] h-[300px] -top-[90px] -left-[90px] rounded-full"
        style={{ borderRadius: 150 }}
      />
      {/* Bottom Blob */}
      <LinearGradient
        colors={["transparent", "rgba(34,197,94,0.3)"]}
        className="absolute w-[300px] h-[300px] -bottom-[90px] -right-[90px]"
        style={{ borderRadius: 150 }}
      />
      {/* Content */}
      <View className="w-full items-center">
        {/* Eyebrow text */}
        <View className="flex-row items-center mb-1.5 mt-2.5">
          <View className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5 shadow-sm shadow-green-500" />
          <Text className="text-green-500 text-xs tracking-[2px]">
            SUSTAINABLE FUTURE
          </Text>
        </View>

        {/* Title */}
        <Text className="text-[32px] text-[#eafdf4] text-center font-bold mt-2.5 leading-10">
          AI Powered <Text className="text-green-500">Carbon Assistant</Text>
        </Text>

        {/* Subtitle */}
        <Text className="text-[#eafdf4] text-base text-center mt-3 opacity-90">
          Your personal guide towards a cleaner, greener, smarter lifestyle.
        </Text>

        {/* Description */}
        <Text className="mt-2.5 text-[#d1fadf] text-sm text-center leading-5 w-[90%]">
          Track emissions, get AI guidance, reduce footprint & achieve
          carbon-free living with intelligent recommendations.
        </Text>

        {/* BUTTONS */}
        <View className="flex-row mt-6 gap-3">
          <TouchableOpacity
            className="bg-green-500 py-3 px-[22px] rounded-full shadow-md shadow-green-500/40"
            onPress={() => router.push("/form")}
            // onPress={() => router.push("/auth/login")}
          >
            <Text className="text-black font-bold text-[15px]">
              Calculate Carbon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-green-500 py-3 px-[22px] rounded-full"
            onPress={() => console.log("Chat route not yet implemented")}
          >
            <Text className="text-[#eafdf4] font-semibold">Start Chat</Text>
          </TouchableOpacity>
        </View>

        {/* EARTH SECTION (Reconstructed from your styles) */}
        <View className="mt-10 w-[60vw] h-[60vw] items-center justify-center relative">
          {/* Inner Ring (Dashed) */}
          <View className="absolute w-[115%] h-[115%] rounded-full border-2 border-dashed border-green-500/50 z-10" />

          {/* Outer Ring */}
          <View className="absolute w-[140%] h-[140%] rounded-full border-2 border-green-500/30" />

          {/* Earth Image Container */}
          <View className="w-full h-full rounded-full z-20 overflow-hidden bg-black/50">
            {/* Replace source with your actual image */}
            <Image
              source={EARTH_IMAGE}
              className="w-full h-full opacity-80"
              resizeMode="cover"
            />
          </View>

          {/* Floating Animation Dot */}
          <Animated.View
            style={{ transform: [{ translateY: dotTranslate }] }}
            className="absolute -top-5 w-3.5 h-3.5 bg-green-500 rounded-full shadow-lg shadow-green-500 z-30"
          />
        </View>
      </View>
    </View>
  );
}
