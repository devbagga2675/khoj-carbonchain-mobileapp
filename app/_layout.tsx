import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Splash Screen (Initial Route) */}
      <Stack.Screen name="index" />

      {/* 2. Main App (Tabs) */}
      <Stack.Screen name="(tabs)" />

      {/* 3. Authentication Flow */}
      <Stack.Screen name="auth" />

      {/* 4. Standalone Calculator Pages */}
      <Stack.Screen
        name="form"
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          presentation: "card",
          headerShown: false,
        }}
      />
    </Stack>
  );
}