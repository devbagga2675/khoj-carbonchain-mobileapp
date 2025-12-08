import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Tab Navigator */}
      <Stack.Screen name="(tabs)" />

      {/* The Calculation Flow */}
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
