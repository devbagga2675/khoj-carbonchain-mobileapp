import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Export this so other files can use it
export const API_BASE = "http://45.114.212.131:8000";

// ✅ Export this function too
export const getGuestId = async () => {
  let id = await AsyncStorage.getItem("guestId");
  if (!id) {
    const randomPart = Math.floor(Math.random() * 10000);
    id = `guest_${Date.now()}_${randomPart}`;
    await AsyncStorage.setItem("guestId", id);
  }
  return id;
};