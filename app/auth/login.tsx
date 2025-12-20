import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://45.114.212.131:8000";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔥 LOGIN API INTEGRATION
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ SAVE TOKEN (CRITICAL FIX)
      await AsyncStorage.setItem("token", data.token);

      // (Optional but useful later)
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Success", "Login successful");

      router.dismissAll();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
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
          {/* Back Button */}
          <View className="pt-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 justify-center pb-10">
            <View className="mb-10">
              <Text className="text-4xl font-bold text-dark mb-3">
                Welcome Back
              </Text>
              <Text className="text-base text-dark-100">
                Log in to sync your carbon data and track progress.
              </Text>
            </View>

            {/* Inputs */}
            <View className="flex flex-col gap-4">
              {/* Email */}
              <View>
                <Text className="text-sm font-semibold text-dark-100 ml-1">
                  Email Address
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="you@example.com"
                  placeholderTextColor="#5a7a6f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(t) =>
                    setForm({ ...form, email: t })
                  }
                />
              </View>

              {/* Password */}
              <View>
                <Text className="text-sm font-semibold text-dark-100 ml-1">
                  Password
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="••••••••"
                  placeholderTextColor="#5a7a6f"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(t) =>
                    setForm({ ...form, password: t })
                  }
                />
                <TouchableOpacity className="self-end mt-2">
                  <Text className="text-xs text-secondary font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className="border border-green-500 h-14 rounded-full items-center justify-center mt-4"
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-white text-lg font-semibold">
                  {loading ? "Logging in..." : "Log In"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-10">
              <Text className="text-dark-100">
                Don't have an account?{" "}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text className="text-secondary font-bold">
                    Register
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
