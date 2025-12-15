import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const router = useRouter();

  // --- ANIMATION VALUES (Unchanged) ---
  const screenFade = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoMoveUp = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textX = useRef(new Animated.Value(-20)).current;
  const earthOpacity = useRef(new Animated.Value(0)).current;
  const earthScale = useRef(new Animated.Value(0.3)).current;
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line1Y = useRef(new Animated.Value(20)).current;
  const ampOpacity = useRef(new Animated.Value(0)).current;
  const ampY = useRef(new Animated.Value(20)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const line2Y = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // 1️⃣ ICON APPEARS
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
    ]).start();

    // 2️⃣ TEXT SLIDES
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(textX, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }, 900);

    // 3️⃣ LOGO MOVES UP
    setTimeout(() => {
      Animated.timing(logoMoveUp, {
        toValue: -height * 0.18,
        duration: 1300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 2000);

    // 4️⃣ EARTH APPEARS
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(earthOpacity, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.spring(earthScale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
      ]).start();
    }, 3000);

    // 5️⃣ TEXT BELOW EARTH
    setTimeout(() => {
      Animated.timing(line1Opacity, { toValue: 1, duration: 900, useNativeDriver: true }).start();
      Animated.timing(line1Y, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }, 4500);

    setTimeout(() => {
      Animated.timing(ampOpacity, { toValue: 1, duration: 900, useNativeDriver: true }).start();
      Animated.timing(ampY, { toValue: 0, duration: 900, useNativeDriver: true }).start();
    }, 5100);

    setTimeout(() => {
      Animated.timing(line2Opacity, { toValue: 1, duration: 900, useNativeDriver: true }).start();
      Animated.timing(line2Y, { toValue: 0, duration: 900, useNativeDriver: true }).start();
    }, 5700);

    // 6️⃣ FADE OUT & NAVIGATE
    setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // NAVIGATE TO YOUR TAB LAYOUT
        router.replace("/(tabs)"); 
      });
    }, 7500);
  }, []);

  return (
    <Animated.View className="flex-1 bg-[#040d07] justify-center" style={{ opacity: screenFade }}>
      
      {/* Background Blobs */}
      <LinearGradient
        colors={["rgba(34,197,94,0.35)", "transparent"]}
        className="absolute w-[350px] h-[350px] -top-[120px] -left-[120px] rounded-full"
      />
      <LinearGradient
        colors={["transparent", "rgba(34,197,94,0.25)"]}
        className="absolute w-[320px] h-[320px] -bottom-[110px] -right-[110px] rounded-full"
      />

      {/* CENTERED LOGO CONTAINER */}
      <View className="absolute w-full items-center" style={{ top: height * 0.38 }}>
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
            transform: [{ translateY: logoMoveUp }],
          }}
        >
          {/* Logo Image */}
          <Animated.Image
            source={require("../assets/logo_footprint.png")} // Ensure this path is correct
            className="w-[70px] h-[70px]"
            style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
          />

          {/* Logo Text */}
          <Animated.View
            className="ml-2.5"
            style={{ opacity: textOpacity, transform: [{ translateX: textX }] }}
          >
            <Text className="text-[30px] font-bold text-[#eafdf4]">CARBON</Text>
            <Text className="text-[30px] font-bold text-[#22c55e] tracking-[3px]">SENSE</Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* EARTH ANIMATION */}
      <Animated.View
        style={{
          opacity: earthOpacity,
          transform: [{ scale: earthScale }],
        }}
      >
        <View 
          className="self-center items-center justify-center"
          style={{ width: width * 0.58, height: width * 0.58, marginTop: height * 0.12 }}
        >
          {/* Earth Image */}
          <Image 
            source={require("../assets/earth.png")} // Ensure this path is correct
            className="w-full h-full rounded-full"
          />
          
          {/* Rings */}
          <View className="absolute w-[118%] h-[118%] rounded-full border-2 border-dashed border-green-500/50" />
          <View className="absolute w-[150%] h-[150%] rounded-full border-[1.5px] border-green-500/30" />
        </View>
      </Animated.View>

      {/* BOTTOM TEXT */}
      <View className="items-center" style={{ marginTop: height * 0.08 }}>
        <Animated.Text
          className="text-lg text-[#d1fadf] tracking-[1px] my-[3px]"
          style={{ opacity: line1Opacity, transform: [{ translateY: line1Y }] }}
        >
          SUSTAINABLE FUTURE
        </Animated.Text>

        <Animated.Text
          className="text-lg text-[#d1fadf] tracking-[1px] my-[3px]"
          style={{ opacity: ampOpacity, transform: [{ translateY: ampY }] }}
        >
          &
        </Animated.Text>

        <Animated.Text
          className="text-xl text-[#22c55e] tracking-[1px] my-[3px]"
          style={{ opacity: line2Opacity, transform: [{ translateY: line2Y }] }}
        >
          AI Powered Carbon Assistant
        </Animated.Text>
      </View>

    </Animated.View>
  );
}