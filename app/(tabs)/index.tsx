import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-primary justify-center items-center p-6">
      <Text className="text-3xl font-bold mb-4">Carbon Chain</Text>
      <TouchableOpacity 
        onPress={() => router.push("/form")}
        className="bg-blue-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Start Calculation</Text>
      </TouchableOpacity>
    </View>
  );
}