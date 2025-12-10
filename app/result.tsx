// app/result.tsx 
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const GRID_EF = 1.02;
const PNG_EF = 1.88;
const PETROL_EF = 2.3;
const DIESEL_EF = 2.7;
const CNG_EF = 2.7;
const SOLAR_PER_KWP = 120 * 1.02;
const TREE_PER_TREE = 5.0;

export default function Result() {
  const router = useRouter();
  const p = useLocalSearchParams();

  const electricity = Number(p.gridElectricity) || 0;
  const gasPNG      = Number(p.gasPNG)         || 0;
  const petrol      = Number(p.petrol)         || 0;
  const diesel      = Number(p.diesel)         || 0;
  const cng         = Number(p.cng)            || 0;
  const solarKwp    = Number(p.solarCapacity)  || 0;
  const trees       = Number(p.treeCount)      || 0;
  const name        = (p.name as string)       || "Your Home";

  const gross       = electricity*GRID_EF + gasPNG*PNG_EF + petrol*PETROL_EF + diesel*DIESEL_EF + cng*CNG_EF;
  const solarOffset = solarKwp * SOLAR_PER_KWP;
  const treeOffset  = trees * TREE_PER_TREE;
  const net         = gross - solarOffset - treeOffset;

  const needSolar = net > 0 ? (net / SOLAR_PER_KWP).toFixed(1) : "0.0";
  const needTrees = net > 0 ? Math.ceil(net / TREE_PER_TREE) : 0;

  return (
    <View className="flex-1 bg-white">
      {/*  */}
      <View className="bg-[#F2F9F8] pt-[60px] px-6 pb-8 rounded-b-[32px] mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-[#4EA89A] items-center justify-center mb-6 shadow-md shadow-[#4EA89A] elevation-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-2xl font-bold">←</Text>
        </TouchableOpacity>

        <Text className="text-[28px] font-extrabold text-slate-800 mb-2 -tracking-[0.5px]">
          Calculation Result
        </Text>
        <Text className="text-[15px] text-slate-500 leading-[22px]">
          Here is your carbon footprint summary
          {"\n"}
          <Text className="font-semibold text-[#2D665B]">{name}</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="px-6">
        {/* Net Result Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-slate-100 items-center">
          <Text className="text-slate-600 text-lg mb-3">Net Carbon Footprint</Text>
          <Text className="text-6xl font-bold text-[#4EA89A]">
            {net > 0 ? Math.round(net) : 0}
          </Text>
          <Text className="text-2xl text-[#4EA89A] mt-1">kg CO₂e</Text>
          {net <= 0 && (
            <Text className="mt-4 px-6 py-2 bg-[#4EA89A] text-white rounded-full font-bold">
              CARBON NEUTRAL
            </Text>
          )}
        </View>

        {/* Breakdown */}
        <View className="space-y-4 mb-6">
          <View className="bg-red-50 rounded-xl p-5 border border-red-100">
            <Text className="text-red-800 font-medium">Total Emissions</Text>
            <Text className="text-3xl font-bold text-red-600 mt-1">{Math.round(gross)} kg</Text>
          </View>
          <View className="bg-green-50 rounded-xl p-5 border border-green-100">
            <Text className="text-green-800 font-medium">Offset by Solar</Text>
            <Text className="text-3xl font-bold text-green-600 mt-1">−{Math.round(solarOffset)} kg</Text>
          </View>
          <View className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
            <Text className="text-emerald-800 font-medium">Offset by Trees</Text>
            <Text className="text-3xl font-bold text-emerald-600 mt-1">−{Math.round(treeOffset)} kg</Text>
          </View>
        </View>

        {/* Suggestions */}
        {net > 0 && (
          <View className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <Text className="text-lg font-semibold text-center mb-4">To become Carbon Neutral</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-4xl">Solar Panel</Text>
                <Text className="text-5xl font-bold text-blue-600 mt-2">{needSolar}</Text>
                <Text className="text-gray-600">kWp</Text>
              </View>
              <Text className="self-center text-2xl text-slate-500">OR</Text>
              <View className="items-center">
                <Text className="text-4xl">Tree</Text>
                <Text className="text-5xl font-bold text-green-600 mt-2">{needTrees}</Text>
                <Text className="text-gray-600">trees</Text>
              </View>
            </View>
          </View>
        )}

        <View className="h-32" /> {/* extra space at bottom */}
      </ScrollView>
    </View>
  );
}