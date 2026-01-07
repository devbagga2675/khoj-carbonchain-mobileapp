// app/result.tsx

import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Values passed from form after API call
  const name = (params.name as string) || "Your Home";
  const netCo2 = Number(params.co2) || 0;
  const solarNeedPanels = Number(params.solarNeedPanels) || 0;
  const treeNeed = Number(params.treeNeed) || 0;

  const surplus = netCo2 < 0 ? Math.abs(Math.round(netCo2)) : 0;
  const isNeutral = netCo2 <= 0;

  const [showSolarPath, setShowSolarPath] = useState(true);

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <View className="bg-card pt-[60px] px-6 pb-8 rounded-b-[32px] shadow-sm shadow-black/50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-card border border-secondary-200 items-center justify-center mb-6 shadow-md shadow-secondary/20 elevation-4"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#EAFDF4" />
        </TouchableOpacity>
        <Text className="text-[28px] font-extrabold text-dark mb-2 -tracking-[0.5px]">
          Calculation Result
        </Text>
        <Text className="text-[15px] text-dark-100 leading-[22px]">
          Here is your carbon footprint summary for{"\n"}
          <Text className="font-semibold text-secondary">{name}</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Net footprint */}
        <View className="bg-card rounded-3xl p-6 mb-6 shadow-lg shadow-black/50 border border-white/5 items-center">
          <Text className="text-dark-100 text-sm font-semibold uppercase tracking-widest mb-2 opacity-70">
            Net Carbon Footprint
          </Text>
          <Text className="text-[64px] leading-[70px] font-black text-secondary">
            {isNeutral ? 0 : Math.round(netCo2)}
          </Text>
          <Text className="text-2xl text-secondary font-bold opacity-80">kg CO₂e</Text>
          {isNeutral && (
            <View className="mt-4 px-6 py-2 bg-secondary rounded-full shadow-sm">
              <Text className="text-black font-bold text-xs uppercase tracking-widest">
                Carbon Neutral{surplus > 0 ? " + Surplus!" : ""}
              </Text>
            </View>
          )}
          {surplus > 0 && (
            <Text className="text-lg text-secondary font-bold mt-3">
              You saved an extra {surplus} kg CO₂e!
            </Text>
          )}
        </View>

        {/* Suggestions - only when net > 0 */}
        {netCo2 > 0 && (
          <View className="bg-card rounded-2xl p-6 border border-white/10 mb-6 shadow-lg shadow-black/40">
            <Text className="text-lg font-bold text-center text-dark mb-6">
              Path to Carbon Neutrality
            </Text>

            {/* Toggle */}
            <View className="flex-row justify-center gap-4 mb-8">
              <TouchableOpacity
                onPress={() => setShowSolarPath(true)}
                className={`px-6 py-2 rounded-full ${showSolarPath ? 'bg-secondary' : 'bg-white/10 border border-white/20'}`}
              >
                <Text className={`font-bold text-sm ${showSolarPath ? 'text-black' : 'text-dark-100'}`}>Go Solar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowSolarPath(false)}
                className={`px-6 py-2 rounded-full ${!showSolarPath ? 'bg-secondary' : 'bg-white/10 border border-white/20'}`}
              >
                <Text className={`font-bold text-sm ${!showSolarPath ? 'text-black' : 'text-dark-100'}`}>Plant Trees</Text>
              </TouchableOpacity>
            </View>

            {/* Selected path */}
            <View className="items-center">
              {showSolarPath ? (
                <>
                  <View className="w-20 h-20 bg-blue-500/10 rounded-full items-center justify-center mb-4 border border-blue-500/20">
                    <Ionicons name="sunny" size={48} color="#3b82f6" />
                  </View>
                  <Text className="text-5xl font-extrabold text-blue-400 mb-2">{solarNeedPanels}</Text>
                  <Text className="text-lg font-bold text-dark-100 opacity-80 uppercase tracking-wider">Panels Needed</Text>
                  <Text className="text-xs text-dark-100 opacity-50 mt-4">
                    One panel reduces ~86 kg CO₂e
                  </Text>
                </>
              ) : (
                <>
                  <View className="w-20 h-20 bg-green-500/10 rounded-full items-center justify-center mb-4 border border-green-500/20">
                    <Ionicons name="leaf" size={48} color="#22c55e" />
                  </View>
                  <Text className="text-5xl font-extrabold text-green-400 mb-2">{treeNeed}</Text>
                  <Text className="text-lg font-bold text-dark-100 opacity-80 uppercase tracking-wider">Trees Needed</Text>
                  <Text className="text-xs text-dark-100 opacity-50 mt-4">
                    One tree reduces 5 kg CO₂e
                  </Text>
                </>
              )}
            </View>
          </View>
        )}

        {/* message: when neutral or surplus */}
        {isNeutral && (
          <View className="items-center py-12">
            <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6 border border-green-500/30">
              <Ionicons name="checkmark-circle" size={72} color="#22c55e" />
            </View>
            <Text className="text-2xl font-bold text-green-400 mb-3">Already Carbon Neutral!</Text>
            <Text className="text-center text-dark-100 text-sm px-6">
              Your solar panels and trees are offsetting all your emissions — and even creating a surplus.
            </Text>
            {surplus > 0 && (
              <Text className="text-4xl font-extrabold text-green-400 mt-6">
                +{surplus} kg CO₂e saved
              </Text>
            )}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}