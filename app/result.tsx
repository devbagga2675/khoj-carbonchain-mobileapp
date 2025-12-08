import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Result() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <Text className="text-white text-xl mb-4">Results Screen</Text>
      <TouchableOpacity 
        onPress={() => router.dismissTo("/")} // Goes back to the first screen of the stack
        className="bg-gray-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}