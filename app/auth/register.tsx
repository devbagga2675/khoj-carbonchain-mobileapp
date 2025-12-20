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

const BASE_URL = "http://45.114.212.131:8000";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    country: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔥 REGISTER API INTEGRATION
  const handleRegister = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          country: form.country,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      Alert.alert("Success", "Account created successfully");

      // Redirect to Login or Tabs
      router.dismissAll();
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
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
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="pt-4 mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>

            <Text className="text-4xl font-bold text-dark mb-3">
              Create Account
            </Text>
            <Text className="text-base text-dark-100">
              Join the movement towards a sustainable future.
            </Text>
          </View>

          {/* Form */}
          <View className="flex flex-col gap-4">
            {/* First & Last Name */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-dark-100 ml-1">
                  First Name
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="John"
                  placeholderTextColor="#5a7a6f"
                  value={form.firstName}
                  onChangeText={(t) => updateForm("firstName", t)}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-dark-100 ml-1">
                  Last Name
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="Doe"
                  placeholderTextColor="#5a7a6f"
                  value={form.lastName}
                  onChangeText={(t) => updateForm("lastName", t)}
                />
              </View>
            </View>

            {/* Email */}
            <TextInput
              className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
              placeholder="Email"
              placeholderTextColor="#5a7a6f"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => updateForm("email", t)}
            />

            {/* Phone */}
            <TextInput
              className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
              placeholder="Phone"
              placeholderTextColor="#5a7a6f"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => updateForm("phone", t)}
            />

            {/* Country */}
            <TextInput
              className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
              placeholder="Country"
              placeholderTextColor="#5a7a6f"
              value={form.country}
              onChangeText={(t) => updateForm("country", t)}
            />

            {/* Password */}
            <TextInput
              className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
              placeholder="Password"
              placeholderTextColor="#5a7a6f"
              secureTextEntry
              value={form.password}
              onChangeText={(t) => updateForm("password", t)}
            />

            {/* Register Button */}
            <TouchableOpacity
              className="border border-green-500 h-14 rounded-full items-center justify-center mt-4"
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-dark-100">
              Already have an account?{" "}
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-secondary font-bold">Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
