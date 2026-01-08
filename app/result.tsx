import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Share,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const calculateOffsets = (co2Val: number) => {
  const trees = Math.ceil(co2Val / 20);
  const solarKw = (co2Val / 230).toFixed(1);
  return { trees, solarKw };
};

export default function Result() {
  const params = useLocalSearchParams();

  const name = (params.name as string) || "Your Calculation";
  const co2 = parseFloat(params.co2 as string) || 0;

  const [offsets, setOffsets] = useState({ trees: 0, solarKw: "0" });

  useEffect(() => {
    setOffsets(calculateOffsets(co2));
  }, [co2]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just calculated my carbon footprint: ${co2} kg CO2e! Calculated via Carbon Chain.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSeverityColor = (value: number) => {
    if (value < 200) return "text-secondary";
    if (value < 500) return "text-warning";
    return "text-danger";
  };

  const getSeverityBorder = (value: number) => {
    if (value < 200) return "border-secondary";
    if (value < 500) return "border-warning";
    return "border-danger";
  };

  const getSeverityBg = (value: number) => {
    // Using opacity on the card background instead of specific light colors
    return "bg-card";
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor="#040D07" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-6 mb-6 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200"
          >
            <Ionicons name="close" size={20} color="#EAFDF4" />
          </TouchableOpacity>
          <Text className="font-psemibold text-dark-100 uppercase tracking-widest text-xs">
            Result
          </Text>
          <View className="w-10" />
        </View>

        <View className="px-6 mb-8">
          <View
            className={`p-8 rounded-[32px] items-center border-2 ${getSeverityBorder(co2)} ${getSeverityBg(co2)}`}
          >
            <Text className="text-dark-100 font-pmedium text-sm mb-2">
              {name}
            </Text>
            <View className="flex-row items-baseline">
              <Text className={`text-6xl font-pbold ${getSeverityColor(co2)}`}>
                {co2.toFixed(1)}
              </Text>
              <Text className="text-dark-100 font-pmedium ml-2 text-lg">
                kg
              </Text>
            </View>
            <Text className="text-dark-100 font-pregular text-sm mt-1 mb-6">
              CO2e Emissions (Bimonthly)
            </Text>

            <View className="w-full h-[1px] bg-secondary-200 mb-6" />

            <Text className="text-center text-dark font-pregular leading-6 px-4">
              {co2 < 200
                ? "Great job! Your footprint is lower than average."
                : co2 < 500
                  ? "Moderate impact. Consider small lifestyle changes to improve."
                  : "High impact. You have significant room for reduction."}
            </Text>
          </View>
        </View>

        <View className="px-6">
          <Text className="text-xl font-pbold text-dark mb-4">
            To Offset This Impact
          </Text>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 bg-card p-5 rounded-2xl border border-secondary-200">
              <View className="bg-secondary-200/20 w-10 h-10 rounded-full items-center justify-center mb-3">
                <Ionicons name="leaf" size={20} color="#22C55E" />
              </View>
              <Text className="text-secondary font-pbold text-3xl mb-1">
                {offsets.trees}
              </Text>
              <Text className="text-dark font-psemibold mb-1">Trees</Text>
              <Text className="text-dark-100 font-pregular text-xs leading-4">
                Planting {offsets.trees} mature trees could absorb this amount
                in a year.
              </Text>
            </View>

            <View className="flex-1 bg-card p-5 rounded-2xl border border-secondary-200">
              <View className="bg-blue-900/30 w-10 h-10 rounded-full items-center justify-center mb-3">
                <Ionicons name="sunny" size={20} color="#60A5FA" />
              </View>
              <Text className="text-blue-400 font-pbold text-3xl mb-1">
                {offsets.solarKw}
              </Text>
              <Text className="text-dark font-psemibold mb-1">kW Solar</Text>
              <Text className="text-dark-100 font-pregular text-xs leading-4">
                A {offsets.solarKw}kW solar rooftop system would offset this
                energy.
              </Text>
            </View>
          </View>

          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-row items-center justify-center bg-secondary py-4 rounded-xl"
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color="black"
                style={{ marginRight: 8 }}
              />
              <Text className="text-dark-200 font-pbold text-base">
                Share Result
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="flex-row items-center justify-center bg-card py-4 rounded-xl border border-secondary-200"
            >
              <Text className="text-dark font-psemibold text-base">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
