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
} from "react-native";

// import { styled } from 'nativewind'; // Not strictly needed if using className directly with Babel plugin
// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

// --- EXTRACTED COMPONENTS (Color Scheme Applied) ---

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
          // The color prop for the active state is used directly here for variety (e.g., orange, blue, green)
          backgroundColor: isVisible ? color : "transparent",
          borderColor: isVisible ? color : "#3B82F6", // Using a default Tailwind blue for inactive border
        }}
      >
        {/* Switched inner box to text-dark-DEFAULT (lightest) */}
        {isVisible && (
          <View className="w-2.5 h-2.5 bg-dark-DEFAULT rounded-[1px]" />
        )}
      </View>
      {/* Switched text color to high-contrast light text */}
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
      {/* Switched label to secondary light text */}
      <Text className="text-xs text-dark-100 mb-1.5">{label}</Text>
      <TextInput
        // Switched input background to card, border to primary-dark, text to high-contrast light
        className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        // Switched placeholder color to subtle neutral
        placeholderTextColor="#86EFAC"
        keyboardType="numeric"
      />
    </View>
  );
};

// --- MAIN COMPONENT (Color Scheme Applied) ---

export default function Form() {
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

      // Data Cleaning
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

  const handleSubmit = () => {
    // TEST MODE: Using dummy data to visualize the result page
    const payload = {
      name: "Eco Test Home",
      address: "42 Green Way, Vadodara",
      gridElectricity: "450",
      gasPNG: "25",
      cngCylinder: "0",
      petrol: "40",
      diesel: "0",
      cng: "15",
      solarPanels: "4",
      solarCapacity: "1.5",
      treeCount: "5",
    };

    console.log("Sending Dummy Payload:", payload);

    router.push({
      pathname: "/result",
      params: { ...formData } as any,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Set overall background to primary dark */}
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header / Top Card */}
        {/* Set card background, rounded bottom corner retained */}
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
              Select the categories that apply to you to input your bimonthly
              data. Tap the checkboxes to reveal fields for your emissions and
              green assets.
            </Text>
          </View>
          {/* <Text className="text-[15px]  leading-[22px]">
            <Text className="font-semibold text-dark-100">
              Active Categories:{" "}
              {Object.values(visibleFields).filter(Boolean).length} • Inputs:{" "}
              {
                Object.keys(formData).filter(
                  (k) => formData[k as keyof CarbonInput] !== ""
                ).length
              }
            </Text>
          </Text> */}
        </View>

        {/* 1. Identifiers */}
        <View className="mb-7 px-6">
          {/* Switched to high-contrast light text */}
          <Text className="text-lg font-semibold text-dark mb-3">Details</Text>
          <View className="mb-3">
            {/* Switched to secondary light text */}
            <Text className="text-xs text-dark-100 mb-1.5">Name / Entity</Text>
            <TextInput
              // Switched input background to card, border to primary-dark, text to high-contrast light
              className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
              value={formData.name}
              onChangeText={(t) => handleChange("name", t)}
              placeholder="e.g. Home"
              placeholderTextColor="#86EFAC" // Subtle neutral
            />
          </View>
          <View className="mb-3">
            {/* Switched to secondary light text */}
            <Text className="text-xs text-dark-100 mb-1.5">Address</Text>
            <TextInput
              // Switched input background to card, border to primary-dark, text to high-contrast light
              className="h-10 border border-secondary-200 rounded-md px-3 bg-card text-sm text-dark"
              value={formData.address}
              onChangeText={(t) => handleChange("address", t)}
              placeholder="City, State"
              placeholderTextColor="#86EFAC" // Subtle neutral
            />
          </View>
        </View>

        {/* 2. Domestic Energy */}
        <View className="mb-7 px-6">
          {/* Switched to high-contrast light text */}
          <Text className="text-lg font-semibold text-dark mb-3">
            Domestic Energy
          </Text>

          <CheckboxRow
            label="Grid Electricity"
            fieldsToCheck={["gridElectricity"]}
            isVisible={!!visibleFields.gridElectricity}
            onToggle={() => toggleVisibility(["gridElectricity"])}
            color="#fb923c" // Orange (Warning) maintained for a visual category cue
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
            color="#fb923c" // Orange (Warning) maintained
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
            color="#fb923c" // Orange (Warning) maintained
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
          {/* Switched to high-contrast light text */}
          <Text className="text-lg font-semibold text-dark mb-3">
            Transport
          </Text>

          <CheckboxRow
            label="Petrol Vehicle"
            fieldsToCheck={["petrol"]}
            isVisible={!!visibleFields.petrol}
            onToggle={() => toggleVisibility(["petrol"])}
            color="#3b82f6" // Blue (Info) maintained for a visual category cue
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
            color="#3b82f6" // Blue (Info) maintained
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
            color="#3b82f6" // Blue (Info) maintained
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
          {/* Switched to high-contrast light text */}
          <Text className="text-lg font-semibold text-dark mb-3">
            Green Assets
          </Text>

          <CheckboxRow
            label="Solar Installation"
            fieldsToCheck={["solarPanels", "solarCapacity"]}
            isVisible={!!visibleFields.solarPanels}
            onToggle={() => toggleVisibility(["solarPanels", "solarCapacity"])}
            color="#22C55E" // Primary Accent (Secondary-DEFAULT) maintained for a visual category cue
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
            color="#22C55E" // Primary Accent (Secondary-DEFAULT) maintained
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
        <View className=" items-center px-6">
          <TouchableOpacity
            className="w-full bg-green-500 py-3 px-[22px] rounded-full mt-4 shadow-lg shadow-secondary/20 h-14 items-center justify-center flex-row gap-2"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-black text-lg font-semibold tracking-wide">
              Calculate Impact
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
