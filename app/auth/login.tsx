import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { API_BASE, getGuestId } from "../../services/api";

const BASE_URL = "http://45.114.212.131:8000";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    // 1. Basic Validation
    if (!form.email || !form.password) {
      Alert.alert(
        "Required Fields",
        "Please enter both your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      // 2. API Request
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      // 3. Persist Auth State
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("isGuest", "false"); // Explicitly not a guest

      if (data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }

      // 4. Navigate to Main App
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      console.log("Starting Guest Flow...");

      // 1. Get or Create the Guest ID locally
      const guestId = await getGuestId();
      console.log("Using Guest ID:", guestId);

      // 2. "Login" by fetching the guest profile to verify connectivity
      // Endpoint: GET /api/guest/profile/<guestId>
      const response = await fetch(`${API_BASE}/api/guest/profile/${guestId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const textResponse = await response.text();
      console.log("GUEST PROFILE STATUS:", response.status);

      // 3. Handle the response
      try {
        const json = JSON.parse(textResponse);

        if (response.ok) {
          console.log("Guest Profile Found/Active:", json);
          // ✅ SUCCESS: Save that we are in guest mode and navigate
          await AsyncStorage.setItem("userType", "guest");
          router.replace("/(tabs)");
        } else {
          // Even if 404 (New Guest), we should let them in
          console.warn("New Guest (Profile not found yet):", json);
          await AsyncStorage.setItem("userType", "guest");
          router.replace("/(tabs)");
        }
      } catch (e) {
        console.error("Server Error (HTML response):", textResponse);
        alert("Server error. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error. Check your connection.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Navigation */}
          <View className="pt-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>
          </View>

          {/* Header Section */}
          <View className="flex-1 justify-center pb-10">
            <View className="mb-10">
              <Text className="text-4xl font-bold text-dark mb-3">
                Welcome Back
              </Text>
              <Text className="text-base text-dark-100">
                Log in to sync your carbon data and track progress.
              </Text>
            </View>

            {/* Form Inputs */}
            <View className="flex flex-col gap-4">
              <View>
                <Text className="text-sm font-semibold text-dark-100 ml-1 mb-2">
                  Email Address
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="you@example.com"
                  placeholderTextColor="#5a7a6f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-dark-100 ml-1 mb-2">
                  Password
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="••••••••"
                  placeholderTextColor="#5a7a6f"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                />
                <TouchableOpacity className="self-end mt-2">
                  <Text className="text-xs text-secondary font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="bg-green-500 h-16 rounded-full items-center justify-center mt-6 shadow-md"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Login</Text>
                )}
              </TouchableOpacity>

              {/* Separator */}
              <View className="flex-row items-center my-2">
                <View className="flex-1 h-[1px] bg-secondary-200 opacity-50" />
                <Text className="mx-4 text-dark-100 text-xs">OR</Text>
                <View className="flex-1 h-[1px] bg-secondary-200 opacity-50" />
              </View>

              {/* Guest Button */}
              <TouchableOpacity
                onPress={handleGuestLogin}
                disabled={loading || guestLoading}
                className="h-16 rounded-full border border-secondary-200 items-center justify-center bg-card"
              >
                {guestLoading ? (
                  <ActivityIndicator color="#4EA89A" />
                ) : (
                  <Text className="text-secondary font-semibold text-sm">
                    Continue as Guest
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Registration Link */}
            <View className="flex-row justify-center mt-10">
              <Text className="text-dark-100">Don't have an account? </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text className="text-secondary font-bold">Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
