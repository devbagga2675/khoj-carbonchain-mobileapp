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

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    country: "",
  });

  const handleRegister = () => {
    // TODO: Add API integration here
    console.log("Register Payload:", form);
    router.dismissAll();
    router.replace("/(tabs)");
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          {/* Header Section */}
          <View className="pt-4 mb-4">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200 shadow-sm mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
            </TouchableOpacity>

            <Text className="text-4xl font-bold text-dark mb-3 tracking-tight">
              Create Account
            </Text>
            <Text className="text-base text-dark-100 leading-6 opacity-90">
              Join the movement towards a sustainable future.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="flex flex-col gap-4">
            {/* Row: First & Last Name */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                  First Name
                </Text>
                <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-3 focus:border-secondary transition-colors">
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="#4EA89A"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    className="flex-1 text-dark text-base h-full"
                    placeholder="John"
                    placeholderTextColor="#5a7a6f"
                    value={form.firstName}
                    onChangeText={(t) => updateForm("firstName", t)}
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                  Last Name
                </Text>
                <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-3 focus:border-secondary transition-colors">
                  <TextInput
                    className="flex-1 text-dark text-base h-full"
                    placeholder="Doe"
                    placeholderTextColor="#5a7a6f"
                    value={form.lastName}
                    onChangeText={(t) => updateForm("lastName", t)}
                  />
                </View>
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                Email
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
                  placeholder="john@example.com"
                  placeholderTextColor="#5a7a6f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(t) => updateForm("email", t)}
                  textContentType="emailAddress"
                />
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                Phone Number
              </Text>
              <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-4 focus:border-secondary transition-colors">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#4EA89A"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-dark text-base h-full"
                  placeholder="+1 555 000 0000"
                  placeholderTextColor="#5a7a6f"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(t) => updateForm("phone", t)}
                />
              </View>
            </View>

            {/* Country */}
            <View>
              <Text className="text-sm font-semibold text-dark-100 mb-0 ml-1">
                Country
              </Text>
              <View className="flex-row items-center h-14 bg-card border border-secondary-200 rounded-full px-4 focus:border-secondary transition-colors">
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color="#4EA89A"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-dark text-base h-full"
                  placeholder="USA"
                  placeholderTextColor="#5a7a6f"
                  value={form.country}
                  onChangeText={(t) => updateForm("country", t)}
                />
              </View>
            </View>

            {/* Password */}
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
                  onChangeText={(t) => updateForm("password", t)}
                  textContentType="newPassword"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="border border-green-500 py-3 px-[22px] rounded-full mt-4 shadow-lg shadow-secondary/20 h-14 items-center justify-center flex-row gap-2"
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold tracking-wide">
                Register
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="text-dark-100 text-base">
              Already have an account?{" "}
            </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-secondary font-bold text-base">
                  Log In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
