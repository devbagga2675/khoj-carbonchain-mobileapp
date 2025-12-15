import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";


//  Dummy login state (replace with Firebase later)
const userLoggedIn = false; // change to false to test unauthenticated UI


// ------------------ DUMMY PROFILE ------------------
const DUMMY_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  country: "India",
  profileImage:
    "https://i.pinimg.com/736x/6f/7b/ed/6f7bed633cace91ac7c1d2e95dd91ee5.jpg",
};


// ------------------ DUMMY HISTORY ------------------
const DUMMY_HISTORY = [
  {
    id: 1,
    title: "Gross: 240 kg | Net: 180 kg",
    inputs: {
      electricity: 120,
      gasPNG: 10,
      cngCyl: 2,
      petrol: 4,
      diesel: 0,
      cng: 3,
      solarKwp: 1,
      solarPanels: 3,
      trees: 2,
    },
    results: {
      gross: 240,
      solarOffset: 40,
      treeOffset: 20,
      net: 180,
      needSolar: 2,
      needTrees: 6,
      val_elec: 120,
      val_gas: 10,
      val_cyl: 2,
      val_petrol: 4,
      val_diesel: 0,
      val_cng: 3,
    },
  },
  {
    id: 2,
    title: "Gross: 310 kg | Net: 260 kg",
    inputs: {
      electricity: 180,
      gasPNG: 12,
      cngCyl: 1,
      petrol: 6,
      diesel: 3,
      cng: 4,
      solarKwp: 0,
      solarPanels: 0,
      trees: 1,
    },
    results: {
      gross: 310,
      solarOffset: 0,
      treeOffset: 10,
      net: 260,
      needSolar: 3,
      needTrees: 10,
      val_elec: 180,
      val_gas: 12,
      val_cyl: 1,
      val_petrol: 6,
      val_diesel: 3,
      val_cng: 4,
    },
  },
];


// ------------------ ResultRow Component ------------------
interface ResultRowProps {
  label: string;
  value: number;
  unit: string;
  impact: number;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, value, unit, impact }) => {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>
        {value} {unit} = {impact} kg
      </Text>
    </View>
  );
};


// ------------------ MAIN PROFILE SCREEN ------------------
const Profile = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (userLoggedIn) {
      setProfile(DUMMY_PROFILE);
      setHistory(DUMMY_HISTORY);
    }
    setLoading(false);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };


  // ------------------ NOT LOGGED IN UI ------------------
  if (!userLoggedIn) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>

        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Welcome</Text>
          <Text style={{ color: "#666", marginBottom: 20 }}>
            Please login or create an account
          </Text>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, styles.authSecondaryButton]}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.authButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }


  // ------------------ LOADING ------------------
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  // ------------------ LOGGED IN UI ------------------
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>

      {/* PROFILE TOP */}
      <View style={styles.topSection}>
        <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        {/* 🔥 Edit Profile only visible when logged in */}
        {userLoggedIn && (
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* DETAILS CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile.phone}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Country</Text>
          <Text style={styles.value}>{profile.country}</Text>
        </View>

        <View style={styles.divider} />

        {/* HISTORY */}
        <TouchableOpacity style={styles.row} onPress={() => setShowHistory(!showHistory)}>
          <Text style={styles.label}>View History</Text>
          <Text style={styles.arrow}>{showHistory ? "▲" : "▶"}</Text>
        </TouchableOpacity>

        {showHistory && (
          <View style={{ marginTop: 12 }}>
            {history.map((item) => (
              <View key={item.id} style={styles.historyContainer}>
                
                <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.historyRow}>
                  <Text style={styles.historyTitle}>• {item.title}</Text>
                  <Text style={styles.dropdownIcon}>
                    {expandedId === item.id ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {expandedId === item.id && (
                  <View style={styles.expandedBox}>
                    <Text style={styles.sectionTitle}>Total Emissions</Text>

                    {item.inputs.electricity > 0 && (
                      <ResultRow
                        label="Electricity"
                        value={item.inputs.electricity}
                        unit="kWh"
                        impact={item.results.val_elec}
                      />
                    )}

                    <Text style={styles.totalLine}>
                      Gross Total: {item.results.gross} kg
                    </Text>

                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* LOGOUT BUTTON */}
      {userLoggedIn && (
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
};

export default Profile;



// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    backgroundColor: "#040D07", 
  },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  topSection: { alignItems: "center", marginBottom: 20 },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#2D665B", 
  },

  name: { fontSize: 22, fontWeight: "700", marginTop: 10, color: "#EAFDF4" },
  email: { fontSize: 14, color: "#D1FADF", marginBottom: 10 },

  editButton: {
    borderColor: "#22C55E",
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 22,
    marginTop: 10,
  },
  editButtonText: { color: "#EAFDF4", fontSize: 14, fontWeight: "600" },

  card: {
    width: "90%",
    backgroundColor: "#121E18", 
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    borderColor: "#2D665B",
    borderWidth: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  label: { fontSize: 16, color: "#D1FADF" },
  value: { fontSize: 16, color: "#EAFDF4", fontWeight: "600" },

  arrow: { fontSize: 18, color: "#22C55E" },

  divider: { height: 1, backgroundColor: "#2D665B", opacity: 0.4 },

  historyContainer: {
    backgroundColor: "#121E18",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2D665B",
  },

  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  historyTitle: { fontSize: 15, fontWeight: "500", color: "#EAFDF4" },
  dropdownIcon: { fontSize: 18, color: "#22C55E" },

  expandedBox: {
    backgroundColor: "#0A1611",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#2D665B",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#EAFDF4",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  resultLabel: { fontWeight: "600", color: "#D1FADF" },
  resultValue: { opacity: 0.9, color: "#EAFDF4" },

  totalLine: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#22C55E",
  },

  
  logoutButton: {
    width: "90%",
    borderWidth: 1.5,
    borderColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
  },

  logoutText: { color: "#22C55E", fontSize: 16, fontWeight: "600" },

  
  authCard: {
    width: "85%",
    backgroundColor: "#121E18",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D665B",
  },

  authTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EAFDF4",
    marginBottom: 10,
  },

  authButton: {
    width: "80%",
    borderWidth: 1.5,
    borderColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },

  authSecondaryButton: {
    borderColor: "#4EA89A",
  },

  authButtonText: {
    color: "#EAFDF4",
    fontSize: 16,
    fontWeight: "600",
  },
});
