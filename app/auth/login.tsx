import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    console.log("Login Payload:", form);
    router.dismissAll();
    router.replace("/(tabs)");
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
          {/* Top Section: Back Button */}
          <View className="pt-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>
          </View>

          {/* Main Content Container: Centered Vertically */}
          <View className="flex-1 justify-center pb-10">
            {/* Header */}
            <View className="mb-10">
              <Text className="text-4xl font-bold text-dark mb-3 tracking-tight">
                Welcome Back
              </Text>
              <Text className="text-base text-dark-100 leading-6 opacity-90">
                Log in to your account to sync your carbon data and track your
                progress.
              </Text>
            </View>

            {/* Form Fields */}
            <View className="flex flex-col gap-4">
              {/* Email Input */}
              <View>
                <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                  Email Address
                </Text>
                <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-4 focus:border-secondary transition-colors">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#4EA89A"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="flex-1 text-dark text-base h-full"
                    placeholder="you@example.com"
                    placeholderTextColor="#5a7a6f"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(t) => setForm({ ...form, email: t })}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                  Password
                </Text>
                <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-4 focus:border-secondary transition-colors">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#4EA89A"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    className="flex-1 text-dark text-base h-full"
                    placeholder="••••••••"
                    placeholderTextColor="#5a7a6f"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(t) => setForm({ ...form, password: t })}
                  />
                </View>
                {/* Forgot Password Link */}
                <TouchableOpacity className="self-end mt-2">
                  <Text className="text-xs text-secondary font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="border border-green-500 py-3 px-[22px] rounded-full mt-4 shadow-lg shadow-secondary/20 h-14 items-center justify-center flex-row gap-2"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold tracking-wide">
                  Log In
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Footer / Switch to Register */}
            <View className="flex-row justify-center mt-10">
              <Text className="text-dark-100 text-base">
                Don't have an account?{" "}
              </Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity>
                  <Text className="text-secondary font-bold text-base">
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
