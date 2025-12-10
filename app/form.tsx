import React, { useState } from 'react';
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
  Alert

} from 'react-native';

// import { styled } from 'nativewind'; // Not strictly needed if using className directly with Babel plugin
// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
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

// --- EXTRACTED COMPONENTS (Fixes Focus Issue) ---

const CheckboxRow = ({ 
  label, 
  fieldsToCheck, 
  isVisible,
  onToggle,
  color = '#4EA89A' 
}: { 
  label: string, 
  fieldsToCheck: (keyof CarbonInput)[], 
  isVisible: boolean,
  onToggle: () => void,
  color?: string 
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
          backgroundColor: isVisible ? color : 'transparent',
          borderColor: isVisible ? color : '#cbd5e1'
        }}
      >
        {isVisible && <View className="w-2.5 h-2.5 bg-white rounded-[1px]" />}
      </View>
      <Text className="text-sm text-slate-700 font-medium">{label}</Text>
    </TouchableOpacity>
  );
};

const InputField = ({ 
  label, 
  value, 
  onChange,
  isVisible,
  placeholder 
}: { 
  label: string, 
  value: string,
  onChange: (text: string) => void,
  isVisible: boolean,
  placeholder?: string 
}) => {
  if (!isVisible) return null;

  return (
    <View className="ml-[30px] mb-3">
      <Text className="text-xs text-slate-500 mb-1.5">{label}</Text>
      <TextInput
        className="h-10 border border-slate-200 rounded-md px-3 bg-slate-50 text-sm text-slate-900"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#cbd5e1"
        keyboardType="numeric"
      />
    </View>
  );
};

// --- MAIN COMPONENT ---

export default function Form() {
  const [formData, setFormData] = useState<CarbonInput>({
    name: '',
    address: '',
    gridElectricity: '',
    gasPNG: '',
    cngCylinder: '',
    petrol: '',
    diesel: '',
    cng: '',
    solarPanels: '',
    solarCapacity: '',
    treeCount: ''
  });

  const [visibleFields, setVisibleFields] = useState<FieldVisibility>({});

  const handleChange = (name: keyof CarbonInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleVisibility = (fields: (keyof CarbonInput)[]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setVisibleFields(prev => {
      const isVisible = !!prev[fields[0]];
      const newState = { ...prev };

      fields.forEach(field => {
        newState[field] = !isVisible;
      });
      
      // Data Cleaning
      if (isVisible) {
        setFormData(currentData => {
          const cleanedData = { ...currentData };
          fields.forEach(f => cleanedData[f] = '');
          return cleanedData;
        });
      }

      return newState;
    });
  };

  const handleSubmit = () => {
    console.log('Active Payload:', formData);
    Alert.alert("Success", "Calculation Complete");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Header / Top Card */}
        <View className="bg-[#F2F9F8] pt-[60px] px-6 pb-8 rounded-b-[32px] mb-6">
          <TouchableOpacity 
            className="w-11 h-11 rounded-full bg-[#4EA89A] items-center justify-center mb-6 shadow-md shadow-[#4EA89A] elevation-4"
            activeOpacity={0.8} 
            onPress={() => console.log('Go Back')}
          >
            <Text className="text-white text-2xl font-bold">←</Text> 
          </TouchableOpacity>

          <Text className="text-[28px] font-extrabold text-slate-800 mb-2 -tracking-[0.5px]">
            New Assessment
          </Text>
          <Text className="text-[15px] text-slate-500 leading-[22px]">
            Organizing your consumption helps calculate a precise footprint.
            {"\n"}
            <Text className="font-semibold text-[#2D665B]">
              Active Categories: {Object.values(visibleFields).filter(Boolean).length} • 
              Inputs: {Object.keys(formData).filter(k => formData[k as keyof CarbonInput] !== '').length}
            </Text>
          </Text>
        </View>

        {/* 1. Identifiers */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-slate-900 mb-3">Details</Text>
          <View className="mb-3">
            <Text className="text-xs text-slate-500 mb-1.5">Name / Entity</Text>
            <TextInput
              className="h-10 border border-slate-200 rounded-md px-3 bg-slate-50 text-sm text-slate-900"
              value={formData.name}
              onChangeText={(t) => handleChange('name', t)}
              placeholder="e.g. Home"
              placeholderTextColor="#cbd5e1"
            />
          </View>
          <View className="mb-3">
            <Text className="text-xs text-slate-500 mb-1.5">Address</Text>
            <TextInput
              className="h-10 border border-slate-200 rounded-md px-3 bg-slate-50 text-sm text-slate-900"
              value={formData.address}
              onChangeText={(t) => handleChange('address', t)}
              placeholder="City, State"
              placeholderTextColor="#cbd5e1"
            />
          </View>
        </View>

        {/* 2. Domestic Energy */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-slate-900 mb-3">Domestic Energy</Text>
          
          <CheckboxRow 
            label="Grid Electricity" 
            fieldsToCheck={['gridElectricity']} 
            isVisible={!!visibleFields.gridElectricity}
            onToggle={() => toggleVisibility(['gridElectricity'])}
            color="#fb923c" 
          />
          <InputField 
            label="Consumption (kWh)" 
            value={formData.gridElectricity}
            onChange={(t) => handleChange('gridElectricity', t)}
            isVisible={!!visibleFields.gridElectricity}
            placeholder="0" 
          />

          <CheckboxRow 
            label="Piped Gas (PNG)" 
            fieldsToCheck={['gasPNG']} 
            isVisible={!!visibleFields.gasPNG}
            onToggle={() => toggleVisibility(['gasPNG'])}
            color="#fb923c" 
          />
          <InputField 
            label="Consumption (SCM)" 
            value={formData.gasPNG}
            onChange={(t) => handleChange('gasPNG', t)}
            isVisible={!!visibleFields.gasPNG}
            placeholder="0" 
          />

          <CheckboxRow 
            label="CNG Cylinder" 
            fieldsToCheck={['cngCylinder']} 
            isVisible={!!visibleFields.cngCylinder}
            onToggle={() => toggleVisibility(['cngCylinder'])}
            color="#fb923c" 
          />
          <InputField 
            label="Weight (kg)" 
            value={formData.cngCylinder}
            onChange={(t) => handleChange('cngCylinder', t)}
            isVisible={!!visibleFields.cngCylinder}
            placeholder="0" 
          />
        </View>

        {/* 3. Transport */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-slate-900 mb-3">Transport</Text>

          <CheckboxRow 
            label="Petrol Vehicle" 
            fieldsToCheck={['petrol']} 
            isVisible={!!visibleFields.petrol}
            onToggle={() => toggleVisibility(['petrol'])}
            color="#3b82f6" 
          />
          <InputField 
            label="Fuel Used (Liters)" 
            value={formData.petrol}
            onChange={(t) => handleChange('petrol', t)}
            isVisible={!!visibleFields.petrol}
            placeholder="0" 
          />

          <CheckboxRow 
            label="Diesel Vehicle" 
            fieldsToCheck={['diesel']} 
            isVisible={!!visibleFields.diesel}
            onToggle={() => toggleVisibility(['diesel'])}
            color="#3b82f6" 
          />
          <InputField 
            label="Fuel Used (Liters)" 
            value={formData.diesel}
            onChange={(t) => handleChange('diesel', t)}
            isVisible={!!visibleFields.diesel}
            placeholder="0" 
          />

          <CheckboxRow 
            label="CNG Vehicle" 
            fieldsToCheck={['cng']} 
            isVisible={!!visibleFields.cng}
            onToggle={() => toggleVisibility(['cng'])}
            color="#3b82f6" 
          />
          <InputField 
            label="Fuel Used (kg)" 
            value={formData.cng}
            onChange={(t) => handleChange('cng', t)}
            isVisible={!!visibleFields.cng}
            placeholder="0" 
          />
        </View>

        {/* 4. Green Assets */}
        <View className="mb-7 px-6">
          <Text className="text-lg font-semibold text-slate-900 mb-3">Green Assets</Text>

          <CheckboxRow 
            label="Solar Installation" 
            fieldsToCheck={['solarPanels', 'solarCapacity']} 
            isVisible={!!visibleFields.solarPanels}
            onToggle={() => toggleVisibility(['solarPanels', 'solarCapacity'])}
            color="#4EA89A" 
          />
          <InputField 
            label="Number of Panels" 
            value={formData.solarPanels}
            onChange={(t) => handleChange('solarPanels', t)}
            isVisible={!!visibleFields.solarPanels}
            placeholder="Qty" 
          />
          <InputField 
            label="System Capacity (kW)" 
            value={formData.solarCapacity}
            onChange={(t) => handleChange('solarCapacity', t)}
            isVisible={!!visibleFields.solarCapacity}
            placeholder="kW" 
          />

          <CheckboxRow 
            label="Trees Planted" 
            fieldsToCheck={['treeCount']} 
            isVisible={!!visibleFields.treeCount}
            onToggle={() => toggleVisibility(['treeCount'])}
            color="#4EA89A" 
          />
          <InputField 
            label="Count" 
            value={formData.treeCount}
            onChange={(t) => handleChange('treeCount', t)}
            isVisible={!!visibleFields.treeCount}
            placeholder="0" 
          />
        </View>

        {/* Action Area */}
        <View className="mt-3 items-end px-6">
          <TouchableOpacity 
            className="bg-[#4EA89A] h-10 px-5 rounded-md justify-center items-center shadow-sm shadow-black/20 elevation-2"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-semibold">Calculate Impact</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}