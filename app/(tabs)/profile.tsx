import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE as BASE_URL, getGuestId } from "../../services/api";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  carbonSaved?: number;
  treesEquivalent?: number;
  emissionsReduced?: number;
  totalEmissions?: number;
  totalOffset?: number;
}

interface CalculationHistory {
  id: string;
  createdAt: string;
  result?: {
    co2?: number;
  };
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [isGuest, setIsGuest] = useState(false);

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const guestId = await getGuestId();

      if (token) {
        setIsGuest(false);
        const profileResp = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileResp.json();
        if (profileData.success) setUser(profileData.user);

        const historyResp = await fetch(`${BASE_URL}/api/calculations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const historyData = await historyResp.json();
        if (historyData.success) setHistory(historyData.calculations || []);

      } else {
        setIsGuest(true);
        const guestResp = await fetch(`${BASE_URL}/api/guest/profile/${guestId}`);
        const guestData = await guestResp.json();
        if (guestData.success) {
          setUser({
            firstName: "Guest",
            lastName: "User",
            email: "Guest Account",
            totalEmissions: guestData.guest.totalEmissions,
            totalOffset: guestData.guest.totalOffset,
          });
        }

        const historyResp = await fetch(`${BASE_URL}/api/guest/calculations/${guestId}`);
        const historyData = await historyResp.json();
        if (historyData.success) setHistory(historyData.calculations || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userType");
    router.replace("/auth/login");
  };

  const getInitials = () => {
    if (!user?.firstName) return "G";
    return user.firstName.charAt(0).toUpperCase();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#22C55E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor="#040D07" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor="#22C55E"
            colors={["#22C55E"]}
          />
        }
      >
        <View className="bg-card pb-8 rounded-b-3xl border-b border-secondary-200 pt-4">
          <View className="flex-row justify-end px-6 mb-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="p-2 bg-danger/10 rounded-full border border-danger/20"
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View className="items-center px-6">
            <View className="w-24 h-24 bg-secondary-200/30 rounded-full items-center justify-center mb-4 border-2 border-secondary">
              <Text className="text-3xl font-pbold text-secondary">
                {getInitials()}
              </Text>
            </View>

            <Text className="text-2xl font-pbold text-dark mb-1">
              {user?.firstName} {user?.lastName}
            </Text>

            <Text className="text-dark-100 font-pregular text-sm mb-6">
              {user?.email}
            </Text>

            {isGuest && (
              <TouchableOpacity
                onPress={() => router.push("/auth/register")}
                className="bg-secondary py-3 px-6 rounded-full flex-row items-center gap-2"
              >
                <Text className="text-dark-200 font-psemibold text-sm">Create Account</Text>
                <Ionicons name="arrow-forward" size={16} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row mt-8 px-6 gap-4">
            <View className="flex-1 bg-primary p-4 rounded-2xl border border-secondary-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="flame" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                <Text className="text-xs font-pbold text-dark-100 uppercase tracking-wider">Emissions</Text>
              </View>
              <Text className="text-2xl font-pbold text-dark">
                {isGuest
                  ? (user?.totalEmissions || 0).toFixed(1)
                  : (user?.emissionsReduced || 0).toFixed(1)}
              </Text>
              <Text className="text-xs text-dark-100 font-pmedium mt-1">kg CO2e</Text>
            </View>

            <View className="flex-1 bg-primary p-4 rounded-2xl border border-secondary-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="leaf" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                <Text className="text-xs font-pbold text-dark-100 uppercase tracking-wider">
                  {isGuest ? "Offset" : "Trees"}
                </Text>
              </View>
              <Text className="text-2xl font-pbold text-dark">
                {isGuest
                  ? (user?.totalOffset || 0).toFixed(1)
                  : (user?.treesEquivalent || 0).toFixed(1)
                }
              </Text>
              <Text className="text-xs text-dark-100 font-pmedium mt-1">
                {isGuest ? "kg removed" : "saved"}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-lg font-pbold text-dark mb-4">History</Text>

          {history.length === 0 ? (
            <View className="bg-card p-8 rounded-2xl items-center justify-center border border-dashed border-secondary-200">
              <Ionicons name="document-text-outline" size={48} color="#2D665B" />
              <Text className="text-dark-100 mt-4 text-center font-pmedium">No calculations yet</Text>
              <Text className="text-dark-100/60 text-xs text-center mt-1 font-pregular">Start a calculation to see it here</Text>
            </View>
          ) : (
            <View className="gap-3">
              {history.map((item) => (
                <View key={item.id} className="bg-card p-4 rounded-2xl border border-secondary-200 flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-secondary-200/20 rounded-full items-center justify-center">
                      <Ionicons name="calculator" size={20} color="#22C55E" />
                    </View>
                    <View>
                      <Text className="text-dark font-psemibold text-sm">Carbon Footprint</Text>
                      <Text className="text-xs text-dark-100 font-pregular mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-dark font-pbold text-base">
                      {item.result?.co2?.toFixed(1) || 0}
                    </Text>
                    <Text className="text-[10px] text-dark-100 font-pmedium">kg CO2</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}