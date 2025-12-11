import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  // Floating dot animation
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const dotTranslate = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  return (
    <View style={styles.container}>

      {/* GREEN BACKGROUND BLOBS */}
      <LinearGradient
        colors={["rgba(34,197,94,0.35)", "transparent"]}
        style={styles.blobTop}
      />

      <LinearGradient
        colors={["transparent", "rgba(34,197,94,0.3)"]}
        style={styles.blobBottom}
      />

      {/* Content */}
      <View style={styles.inner}>
        {/* Eyebrow text */}
        <View style={styles.eyebrowWrap}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>SUSTAINABLE FUTURE</Text>
        </View>

        <Text style={styles.title}>
          AI Powered <Text style={styles.titleGradient}>Carbon Assistant</Text>
        </Text>

        <Text style={styles.subText}>
          Your personal guide towards a cleaner, greener, smarter lifestyle.
        </Text>

        <Text style={styles.desc}>
          Track emissions, get AI guidance, reduce footprint & achieve carbon-free living with intelligent recommendations.
        </Text>

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => console.log("Chat route not yet implemented")} // Placeholder for Chat
          >
            <Text style={styles.btnPrimaryText}>Start Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnGhost}
            onPress={() => router.push("/form")} // Mapped to your Form route
          >
            <Text style={styles.btnGhostText}>Carbon Calculator</Text>
          </TouchableOpacity>
        </View>

        {/* EARTH + ANIMATIONS */}
        <View style={styles.earthWrapper}>
          {/* Ensure you have the asset at this path or update the require */}
          <Image
            source={require("../../assets/earth.png")}
            style={styles.earth}
          />

          {/* Dashed rotating ring */}
          <View style={styles.ring} />

          {/* Outer ring */}
          <View style={styles.ring2} />

          {/* Floating animated dot */}
          <Animated.View
            style={[
              styles.dot,
              {
                transform: [{ translateY: dotTranslate }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// =====================================================
//                STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040d07",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  inner: {
    width: "100%",
    alignItems: "center",
  },

  /* Background blobs */
  blobTop: {
    position: "absolute",
    width: 300,
    height: 300,
    top: -90,
    left: -90,
    borderRadius: 200,
  },
  blobBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    bottom: -90,
    right: -90,
    borderRadius: 200,
  },

  /* Eyebrow */
  eyebrowWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 10,
  },
  eyebrow: {
    color: "#22c55e",
    fontSize: 12,
    letterSpacing: 2,
  },
  eyebrowDot: {
    width: 10,
    height: 10,
    backgroundColor: "#22c55e",
    borderRadius: 50,
    marginRight: 6,
    shadowColor: "#22c55e",
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },

  /* Title */
  title: {
    fontSize: 32,
    color: "#eafdf4",
    textAlign: "center",
    fontWeight: "700",
    marginTop: 10,
    lineHeight: 40,
  },
  titleGradient: {
    color: "#22c55e",
  },

  subText: {
    color: "#eafdf4",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    opacity: 0.9,
  },

  desc: {
    marginTop: 10,
    color: "#d1fadf",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    width: "90%",
  },

  /* Buttons */
  btnRow: {
    flexDirection: "row",
    marginTop: 25,
    gap: 12,
  },

  btnPrimary: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 50,
    shadowColor: "#22c55e",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  btnPrimaryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },

  btnGhost: {
    borderWidth: 1,
    borderColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 50,
  },
  btnGhostText: {
    color: "#eafdf4",
    fontWeight: "600",
  },

  /* Earth Section */
  earthWrapper: {
    marginTop: 40,
    width: width * 0.6,
    height: width * 0.6,
    alignItems: "center",
    justifyContent: "center",
  },

  earth: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
    zIndex: 3,
  },

  ring: {
    position: "absolute",
    width: "115%",
    height: "115%",
    borderRadius: 300,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(34,197,94,0.5)",
    zIndex: 1,
  },

  ring2: {
    position: "absolute",
    width: "140%",
    height: "140%",
    borderRadius: 300,
    borderWidth: 2,
    borderColor: "rgba(34,197,94,0.3)",
  },

  /* Floating dot */
  dot: {
    position: "absolute",
    top: -20,
    width: 14,
    height: 14,
    backgroundColor: "#22c55e",
    borderRadius: 50,
    shadowColor: "#22c55e",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 10,
  },
});