import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE as BASE_URL } from "../../services/api";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleRegister = async () => {
    // Basic Validation
    if (!form.email || !form.password || !form.firstName) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // API Call (Section 4.1)
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          countryCode: "+91", // Defaulting to India as per API context
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success", "Account created! Please log in.", [
          { text: "OK", onPress: () => router.replace("/auth/login") },
        ]);
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Something went wrong."
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to server.");
      console.error(error);
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
            padding: 24,
            justifyContent: "center",
          }}
        >
          <View className="pt-8 pb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 shadow-sm"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>
          </View>
          <View className="mb-10">
            <Text className="text-4xl font-bold text-dark mb-3">
              Create Account
            </Text>
            <Text className="text-base text-dark-100">
              Join us to track your Carbon Emissions
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 flex flex-col gap-4">
            <View className="flex-row justify-between gap-2">
              <View className="flex-1">
                <Text className="text-xs text-secondary-100 mb-1 ml-1">
                  First Name
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="John"
                  value={form.firstName}
                  onChangeText={(t) => setForm({ ...form, firstName: t })}
                  placeholderTextColor="#5a7a6f"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-secondary-100 mb-1 ml-1">
                  Last Name
                </Text>
                <TextInput
                  className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                  placeholder="Doe"
                  value={form.lastName}
                  onChangeText={(t) => setForm({ ...form, lastName: t })}
                  placeholderTextColor="#5a7a6f"
                />
              </View>
            </View>

            <View>
              <Text className="text-xs text-secondary-100 mb-1 ml-1">
                Email
              </Text>
              <TextInput
                className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                placeholder="john@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
                placeholderTextColor="#5a7a6f"
              />
            </View>

            <View>
              <Text className="text-xs text-secondary-100 mb-1 ml-1">
                Phone (Optional)
              </Text>
              <TextInput
                className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                placeholder="9876543210"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(t) => setForm({ ...form, phone: t })}
                placeholderTextColor="#5a7a6f"
              />
            </View>

            <View>
              <Text className="text-xs text-secondary-100 mb-1 ml-1">
                Password
              </Text>
              <TextInput
                className="h-14 bg-card border border-secondary-200 rounded-full px-4 text-dark"
                placeholder="********"
                secureTextEntry
                value={form.password}
                onChangeText={(t) => setForm({ ...form, password: t })}
                placeholderTextColor="#5a7a6f"
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-green-500 h-16 rounded-full items-center justify-center mt-6 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} className="mt-4">
              <Text className="text-center text-secondary-100">
                Already have an account?{" "}
                <Text className="text-secondary font-bold">Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
