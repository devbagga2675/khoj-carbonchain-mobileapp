import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Added Icon Library

// --- CONSTANTS ---
const GRID_EF = 1.02;
const PNG_EF = 1.88;
const PETROL_EF = 2.3;
const DIESEL_EF = 2.7;
const CNG_EF = 2.7;
const SOLAR_PER_KWP = 120 * 1.02;
const TREE_PER_TREE = 5.0;

// --- HELPER COMPONENT FOR ROWS ---
const ResultRow = ({ label, value, unit, impact, colorClass, iconName }: any) => (
  <View className="flex-row justify-between items-center py-2.5 border-b border-white/5 last:border-0">
    <View className="flex-row items-center gap-3">
       {/* Added Icon Support */}
      {iconName && (
        <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
            <Ionicons name={iconName} size={14} color={colorClass ? "#ef4444" : "#22c55e"} style={{ opacity: 0.8 }} />
        </View>
      )}
      <View>
        <Text className="text-sm font-medium text-dark opacity-90">{label}</Text>
        <Text className="text-xs text-dark-100 opacity-60">{value} {unit}</Text>
      </View>
    </View>
    <Text className={`text-base font-bold ${colorClass}`}>
      {impact > 0 ? "+" : ""}{Math.round(impact)}
    </Text>
  </View>
);

export default function Result() {
  const router = useRouter();
  const urlParams = useLocalSearchParams();

  // --- DUMMY DATA CONFIGURATION ---
  const TEST_MODE = true; // Set to FALSE when you want to use real form data
  
  const dummyData = {
    name: "Sample Villa",
    gridElectricity: "420", // High usage
    gasPNG: "25",
    cngCylinder: "0",
    petrol: "55",           // SUV usage
    diesel: "0",
    cng: "0",
    solarCapacity: "2",     // Has small solar setup
    solarPanels: "6",
    treeCount: "8"          // Has a garden
  };

  // Logic: Use URL params if they exist, otherwise fallback to dummy data
  const p = (Object.keys(urlParams).length > 0 && !TEST_MODE) ? urlParams : dummyData;

  // 1. Parsing Inputs
  const electricity = Number(p.gridElectricity) || 0;
  const gasPNG      = Number(p.gasPNG)         || 0;
  const cngCyl      = Number(p.cngCylinder)    || 0; 
  const petrol      = Number(p.petrol)         || 0;
  const diesel      = Number(p.diesel)         || 0;
  const cng         = Number(p.cng)            || 0;
  const solarKwp    = Number(p.solarCapacity)  || 0;
  const solarPanels = Number(p.solarPanels)    || 0;
  const trees       = Number(p.treeCount)      || 0;
  const name        = (p.name as string)       || "Your Home";

  // 2. Calculations
  const val_elec   = electricity * GRID_EF;
  const val_gas    = gasPNG * PNG_EF;
  const val_cyl    = cngCyl * CNG_EF;
  const val_petrol = petrol * PETROL_EF;
  const val_diesel = diesel * DIESEL_EF;
  const val_cng    = cng * CNG_EF;

  const gross      = val_elec + val_gas + val_cyl + val_petrol + val_diesel + val_cng;
  const solarOffset = solarKwp * SOLAR_PER_KWP;
  const treeOffset  = trees * TREE_PER_TREE;
  const net         = gross - solarOffset - treeOffset;

  const needSolar = net > 0 ? (net / SOLAR_PER_KWP).toFixed(1) : "0.0";
  const needTrees = net > 0 ? Math.ceil(net / TREE_PER_TREE) : 0;

  return (
    <View className="flex-1 bg-primary"> 
      {/* Changed bg-white to bg-primary (Dark Background) */}
      
      {/* --- HEADER --- */}
      {/* Changed bg-[#F2F9F8] to bg-card (Dark Surface) */}
      <View className="bg-card pt-[60px] px-6 pb-8 rounded-b-[32px] shadow-sm shadow-black/50">
        <TouchableOpacity
          onPress={() => router.back()}
          // Changed bg-[#4EA89A] to bg-secondary-200 (Darker Teal)
          className="w-11 h-11 rounded-full bg-card border border-secondary-200 items-center justify-center mb-6 shadow-md shadow-secondary/20 elevation-4"
          activeOpacity={0.8}
        >
          {/* Replaced Text Arrow with Ionicons */}
          <Ionicons name="arrow-back" size={24} color="#EAFDF4" />
        </TouchableOpacity>

        {/* Text colors updated to theme */}
        <Text className="text-[28px] font-extrabold text-dark mb-2 -tracking-[0.5px]">
          Calculation Result
        </Text>
        <Text className="text-[15px] text-dark-100 leading-[22px]">
          Here is your carbon footprint summary for
          {"\n"}
          <Text className="font-semibold text-secondary">{name}</Text>
          {TEST_MODE && <Text className="text-red-400 text-xs font-bold"> (PREVIEW MODE)</Text>}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* --- NET RESULT CARD --- */}
        {/* Changed bg-white to bg-card, updated border and shadow */}
        <View className="bg-card rounded-3xl p-6 mb-6 shadow-lg shadow-black/50 border border-white/5 items-center">
          <Text className="text-dark-100 text-sm font-semibold uppercase tracking-widest mb-2 opacity-70">Net Carbon Footprint</Text>
          {/* Updated text color to secondary */}
          <Text className="text-[64px] leading-[70px] font-black text-secondary">
            {net > 0 ? Math.round(net) : 0}
          </Text>
          <Text className="text-2xl text-secondary font-bold opacity-80">kg CO₂e</Text>
          {net <= 0 && (
            <View className="mt-4 px-6 py-2 bg-secondary rounded-full shadow-sm">
              <Text className="text-black font-bold text-xs uppercase tracking-widest">
                Carbon Neutral
              </Text>
            </View>
          )}
        </View>

        {/* --- BREAKDOWN SECTION --- */}
        <View className="space-y-4 mb-8">
          
          {/* 1. Gross Emissions Card */}
          {/* Darkened background (red-900/10) and borders */}
          <View className="bg-red-900/10 rounded-2xl p-5 border border-red-500/20 mb-2">
            <View className="flex-row items-center mb-4">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <Text className="text-red-400 font-bold uppercase text-xs tracking-wider">Total Emissions</Text>
            </View>
            
            {/* Input Rows */}
            <View className="space-y-1 mb-4">
              {electricity > 0 && <ResultRow label="Electricity" value={electricity} unit="kWh" impact={val_elec} colorClass="text-red-400" iconName="flash-outline" />}
              {gasPNG > 0      && <ResultRow label="Piped Gas" value={gasPNG} unit="SCM" impact={val_gas} colorClass="text-red-400" iconName="flame-outline" />}
              {cngCyl > 0      && <ResultRow label="CNG Cyl" value={cngCyl} unit="kg" impact={val_cyl} colorClass="text-red-400" iconName="cube-outline" />}
              {petrol > 0      && <ResultRow label="Petrol" value={petrol} unit="L" impact={val_petrol} colorClass="text-red-400" iconName="car-sport-outline" />}
              {diesel > 0      && <ResultRow label="Diesel" value={diesel} unit="L" impact={val_diesel} colorClass="text-red-400" iconName="bus-outline" />}
              {cng > 0         && <ResultRow label="CNG Vehicle" value={cng} unit="kg" impact={val_cng} colorClass="text-red-400" iconName="car-outline" />}
            </View>

            {/* Total Line */}
            <View className="border-t border-red-500/20 pt-3 flex-row justify-between items-baseline">
              <Text className="text-red-200 font-bold text-sm">Gross Total</Text>
              <Text className="text-3xl font-extrabold text-red-400">{Math.round(gross)} <Text className="text-sm font-medium opacity-70">kg</Text></Text>
            </View>
          </View>

          {/* 2. Solar Offset Card */}
          {(solarKwp > 0) && (
            // Darkened background (green-900/10)
            <View className="bg-green-900/10 rounded-2xl p-5 border border-green-500/20 mb-2">
              <View className="flex-row items-center mb-4">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <Text className="text-green-400 font-bold uppercase text-xs tracking-wider">Solar Savings</Text>
              </View>
              
              <ResultRow label="Solar Capacity" value={solarPanels} unit="panels" impact={-solarOffset} colorClass="text-green-400" iconName="sunny-outline" />

              <View className="border-t border-green-500/20 pt-3 flex-row justify-between items-baseline">
                <Text className="text-green-200 font-bold text-sm">Offset</Text>
                <Text className="text-3xl font-extrabold text-green-400">−{Math.round(solarOffset)} <Text className="text-sm font-medium opacity-70">kg</Text></Text>
              </View>
            </View>
          )}

          {/* 3. Tree Offset Card */}
          {(trees > 0) && (
            // Darkened background (emerald-900/10)
            <View className="bg-emerald-900/10 rounded-2xl p-5 border border-emerald-500/20 mb-2">
              <View className="flex-row items-center mb-4">
                <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <Text className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Nature Savings</Text>
              </View>
              
              <ResultRow label="Trees Planted" value={trees} unit="Nos" impact={-treeOffset} colorClass="text-emerald-400" iconName="leaf-outline" />

              <View className="border-t border-emerald-500/20 pt-3 flex-row justify-between items-baseline">
                <Text className="text-emerald-200 font-bold text-sm">Offset</Text>
                <Text className="text-3xl font-extrabold text-emerald-400">−{Math.round(treeOffset)} <Text className="text-sm font-medium opacity-70">kg</Text></Text>
              </View>
            </View>
          )}

        </View>

        {/* --- SUGGESTIONS --- */}
        {net > 0 && (
          // Changed bg-slate-50 to bg-card, border to white/10
          <View className="bg-card rounded-2xl p-6 border border-white/10 mb-6 shadow-lg shadow-black/40">
            <Text className="text-lg font-bold text-center text-dark mb-6">Path to Carbon Neutrality</Text>
            
            <View className="flex-row justify-between items-center px-2">
              <View className="items-center flex-1">
                {/* Updated Icon Container */}
                <View className="w-12 h-12 bg-blue-500/10 rounded-full items-center justify-center mb-2 border border-blue-500/20">
                   {/* Replaced Emoji with Icon */}
                   <Ionicons name="sunny" size={24} color="#3b82f6" />
                </View>
                <Text className="text-3xl font-extrabold text-blue-400 mb-1">{needSolar}</Text>
                <Text className="text-xs font-bold text-dark-100 opacity-60 uppercase tracking-wider text-center">kW Solar Needed</Text>
              </View>
              
              {/* Divider Color Update */}
              <View className="h-16 w-[1px] bg-white/10 mx-2" />
              
              <View className="items-center flex-1">
                {/* Updated Icon Container */}
                <View className="w-12 h-12 bg-green-500/10 rounded-full items-center justify-center mb-2 border border-green-500/20">
                   {/* Replaced Emoji with Icon */}
                   <Ionicons name="leaf" size={24} color="#22c55e" />
                </View>
                <Text className="text-3xl font-extrabold text-green-400 mb-1">{needTrees}</Text>
                <Text className="text-xs font-bold text-dark-100 opacity-60 uppercase tracking-wider text-center">Trees Needed</Text>
              </View>
            </View>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}