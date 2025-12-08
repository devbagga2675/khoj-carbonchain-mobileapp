import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Form() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <Text className="text-white text-xl mb-4">Form Input Screen</Text>
      <TouchableOpacity 
        onPress={() => router.push("/result")}
        className="bg-green-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Submit & Calculate</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text className="text-gray-400">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}