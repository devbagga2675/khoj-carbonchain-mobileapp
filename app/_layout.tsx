import { Stack, useRouter, useSegments, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./global.css";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // ✅ NEW: Check if they are a guest
        const userType = await AsyncStorage.getItem("userType"); 
        const isGuest = userType === "guest";

        const inAuthGroup = segments?.[0] === "auth";
        
        // Fix for "Types '2 | 1' and '0'" error
        const isSplash = pathname === "/" || (segments?.length as number) === 0;

        // 1. PROTECTION LOGIC: 
        // If NO token AND NOT a guest, and trying to access a protected page...
        if (!token && !isGuest && !inAuthGroup && !isSplash) {
          // ... Kick them to login
          router.replace("/auth/login");
        } 
        
        // 2. REDIRECT LOGIC:
        // If Logged in (Token) but trying to access Login/Register...
        // (We allow Guests to access Auth pages so they can Sign Up if they want)
        else if (token && inAuthGroup) {
          router.replace("/(tabs)");
        }
        
      } catch (e) {
        console.error("Auth error", e);
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, [segments, pathname]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="form" options={{ presentation: "card" }} />
      <Stack.Screen name="result" options={{ presentation: "card" }} />
    </Stack>
  );
}