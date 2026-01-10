import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { API_BASE as BASE_URL, getGuestId } from "../services/api";

export interface CarbonInput {
  name?: string;
  address?: string;
  gridElectricity: string;
  gasPNG: string;
  cngCylinder: string;
  petrol: string;
  diesel: string;
  cng: string;
  solarPanels: string;
  solarCapacity: string;
  treeCount: string;
}

type FieldVisibility = {
  [key in keyof CarbonInput]?: boolean;
};

// --- EXTRACTED COMPONENTS ---

const CheckboxRow = ({
  label,
  fieldsToCheck,
  isVisible,
  onToggle,
  color = "#4EA89A",
}: {
  label: string;
  fieldsToCheck: (keyof CarbonInput)[];
  isVisible: boolean;
  onToggle: () => void;
  color?: string;
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center mb-3"
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        className="w-5 h-5 rounded border-2 mr-2.5 items-center justify-center"
        style={{
          backgroundColor: isVisible ? color : "transparent",
          borderColor: isVisible ? color : "#3B82F6",
        }}
      >
        {isVisible && (
          <View className="w-2.5 h-2.5 bg-dark-DEFAULT rounded-[1px]" />
        )}
      </View>
      <Text className="text-sm text-dark font-medium">{label}</Text>
    </TouchableOpacity>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  isVisible,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  isVisible: boolean;
  placeholder?: string;
}) => {
  if (!isVisible) return null;

  return (
    <View className="ml-[30px] mb-3">
      <Text className="text-xs text-dark-100 mb-1.5">{label}</Text>
      <TextInput
        className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#86EFAC"
        keyboardType="numeric"
      />
    </View>
  );
};

// --- MAIN COMPONENT ---

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CarbonInput>({
    name: "",
    address: "",
    gridElectricity: "",
    gasPNG: "",
    cngCylinder: "",
    petrol: "",
    diesel: "",
    cng: "",
    solarPanels: "",
    solarCapacity: "",
    treeCount: "",
  });

  const [visibleFields, setVisibleFields] = useState<FieldVisibility>({});

  const handleChange = (name: keyof CarbonInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleVisibility = (fields: (keyof CarbonInput)[]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setVisibleFields((prev) => {
      const isVisible = !!prev[fields[0]];
      const newState = { ...prev };

      fields.forEach((field) => {
        newState[field] = !isVisible;
      });

      if (isVisible) {
        setFormData((currentData) => {
          const cleanedData = { ...currentData };
          fields.forEach((f) => (cleanedData[f] = ""));
          return cleanedData;
        });
      }

      return newState;
    });
  };

  // 🔥 CORRECTED: Uses proper API Endpoint and Logic
  const handleCalculateImpact = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const guestId = await getGuestId(); // Get the ID

      // 1. Prepare Payload
      const payload: any = {
        name: formData.name || "My Calculation",
        address: formData.address || "",
        lightUnits: Number(formData.gridElectricity) || 0, // Doc says 'lightUnits', not gridElectricity
        gasUnits: Number(formData.gasPNG) || 0,
        petrolUnits: Number(formData.petrol) || 0,
        dieselUnits: Number(formData.diesel) || 0,
        cngUnits: Number(formData.cng) || 0,
        treeCount: Number(formData.treeCount) || 0,
        solarPanels: Number(formData.solarPanels) || 0,
        // Add other fields if your API supports them, otherwise map them carefully
      };

      // 2. Add Headers
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        // Logged In User
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        // Guest User: Must add guestId to BODY (Per docs Section 6.1)
        payload["guestId"] = guestId;
      }

      console.log("Sending Payload:", payload);

      // 3. Send Request (ALWAYS to /api/calculate)
      const response = await fetch(`${BASE_URL}/api/calculate`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const textResponse = await response.text();
      console.log("Response:", textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error("Server returned an error page instead of data.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Calculation failed.");
      }

      // 4. Navigate to Result
      router.push({
        pathname: "/result",
        params: {
          name: payload.name,
          co2: data.data?.co2 || 0, // Accessing data.data.co2 based on docs
          solarNeedPanels: 0, // API doesn't seem to return suggestions in docs, adjust if needed
          treeNeed: 0,
        },
      });

    } catch (error: any) {
      Alert.alert("Calculation Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="bg-card pt-[60px] px-6 pb-8 rounded-b-xl mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className=" mb-6 w-10 h-10 rounded-full bg-card items-center justify-center border border-secondary-200"
          >
            <Ionicons name="arrow-back" size={20} color="#EAFDF4" />
          </TouchableOpacity>

          <View className="mb-2">
            <Text className="text-4xl font-bold text-secondary mb-2 tracking-tight">
              Measure Your Impact
            </Text>
            <Text className="text-base text-secondary-100 leading-6 opacity-90">
              Select the categories that apply to you.
            </Text>
          </View>
        </View>

        {/* 1. Identifiers */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-dark mb-3">Details</Text>
          <View className="mb-3">
            <Text className="text-xs text-dark-100 mb-1.5">Name / Entity</Text>
            <TextInput
              className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
              value={formData.name}
              onChangeText={(t) => handleChange("name", t)}
              placeholder="e.g. Home"
              placeholderTextColor="#86EFAC"
            />
          </View>
          <View className="mb-3">
            <Text className="text-xs text-dark-100 mb-1.5">Address</Text>
            <TextInput
              className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
              value={formData.address}
              onChangeText={(t) => handleChange("address", t)}
              placeholder="City, State"
              placeholderTextColor="#86EFAC"
            />
          </View>
        </View>

        {/* 2. Domestic Energy */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-dark mb-3">
            Domestic Energy
          </Text>
          <CheckboxRow
            label="Grid Electricity"
            fieldsToCheck={["gridElectricity"]}
            isVisible={!!visibleFields.gridElectricity}
            onToggle={() => toggleVisibility(["gridElectricity"])}
            color="#fb923c"
          />
          <InputField
            label="Consumption (kWh)"
            value={formData.gridElectricity}
            onChange={(t) => handleChange("gridElectricity", t)}
            isVisible={!!visibleFields.gridElectricity}
            placeholder="0"
          />
          <CheckboxRow
            label="Piped Gas (PNG)"
            fieldsToCheck={["gasPNG"]}
            isVisible={!!visibleFields.gasPNG}
            onToggle={() => toggleVisibility(["gasPNG"])}
            color="#fb923c"
          />
          <InputField
            label="Consumption (SCM)"
            value={formData.gasPNG}
            onChange={(t) => handleChange("gasPNG", t)}
            isVisible={!!visibleFields.gasPNG}
            placeholder="0"
          />
          <CheckboxRow
            label="CNG Cylinder"
            fieldsToCheck={["cngCylinder"]}
            isVisible={!!visibleFields.cngCylinder}
            onToggle={() => toggleVisibility(["cngCylinder"])}
            color="#fb923c"
          />
          <InputField
            label="Weight (kg)"
            value={formData.cngCylinder}
            onChange={(t) => handleChange("cngCylinder", t)}
            isVisible={!!visibleFields.cngCylinder}
            placeholder="0"
          />
        </View>

        {/* 3. Transport */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-dark mb-3">
            Transport
          </Text>
          <CheckboxRow
            label="Petrol Vehicle"
            fieldsToCheck={["petrol"]}
            isVisible={!!visibleFields.petrol}
            onToggle={() => toggleVisibility(["petrol"])}
            color="#3b82f6"
          />
          <InputField
            label="Fuel Used (Liters)"
            value={formData.petrol}
            onChange={(t) => handleChange("petrol", t)}
            isVisible={!!visibleFields.petrol}
            placeholder="0"
          />
          <CheckboxRow
            label="Diesel Vehicle"
            fieldsToCheck={["diesel"]}
            isVisible={!!visibleFields.diesel}
            onToggle={() => toggleVisibility(["diesel"])}
            color="#3b82f6"
          />
          <InputField
            label="Fuel Used (Liters)"
            value={formData.diesel}
            onChange={(t) => handleChange("diesel", t)}
            isVisible={!!visibleFields.diesel}
            placeholder="0"
          />
          <CheckboxRow
            label="CNG Vehicle"
            fieldsToCheck={["cng"]}
            isVisible={!!visibleFields.cng}
            onToggle={() => toggleVisibility(["cng"])}
            color="#3b82f6"
          />
          <InputField
            label="Fuel Used (kg)"
            value={formData.cng}
            onChange={(t) => handleChange("cng", t)}
            isVisible={!!visibleFields.cng}
            placeholder="0"
          />
        </View>

        {/* 4. Green Assets */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-dark mb-3">
            Green Assets
          </Text>
          <CheckboxRow
            label="Solar Installation"
            fieldsToCheck={["solarPanels", "solarCapacity"]}
            isVisible={!!visibleFields.solarPanels}
            onToggle={() => toggleVisibility(["solarPanels", "solarCapacity"])}
            color="#22C55E"
          />
          <InputField
            label="Number of Panels"
            value={formData.solarPanels}
            onChange={(t) => handleChange("solarPanels", t)}
            isVisible={!!visibleFields.solarPanels}
            placeholder="Qty"
          />
          <InputField
            label="System Capacity (kW)"
            value={formData.solarCapacity}
            onChange={(t) => handleChange("solarCapacity", t)}
            isVisible={!!visibleFields.solarCapacity}
            placeholder="kW"
          />
          <CheckboxRow
            label="Trees Planted"
            fieldsToCheck={["treeCount"]}
            isVisible={!!visibleFields.treeCount}
            onToggle={() => toggleVisibility(["treeCount"])}
            color="#22C55E"
          />
          <InputField
            label="Count"
            value={formData.treeCount}
            onChange={(t) => handleChange("treeCount", t)}
            isVisible={!!visibleFields.treeCount}
            placeholder="0"
          />
        </View>

        {/* Action Area */}
        <View className="items-center px-6">
          <TouchableOpacity
            className="w-full bg-green-500 py-3 px-[22px] rounded-full mt-4 shadow-lg shadow-secondary/20 h-16 items-center justify-center flex-row gap-2"
            onPress={handleCalculateImpact}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black text-lg font-semibold tracking-wide">
                Calculate Impact
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}