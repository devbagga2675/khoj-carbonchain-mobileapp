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


  //  1. DUMMY PROFILE + HISTORY (TEMPORARY)
  //  Replace this later with real API responses.


const DUMMY_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  country: "India",
  profileImage:
    "https://i.pinimg.com/736x/6f/7b/ed/6f7bed633cace91ac7c1d2e95dd91ee5.jpg",
};

// 10 dummy history entries — API can return same structure
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


  //  A simple ResultRow component

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


  //  MAIN PROFILE SCREEN


const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);


    //  2. FETCH PROFILE (dummy now, API later)

  const fetchProfile = async () => {
    try {
      // ⭐ Replace with your real API later
      // const res = await fetch("https://your-api.com/profile");
      // const data = await res.json();

      const data = DUMMY_PROFILE; // ← TEMP
      setProfile(data);
      setLoading(false);
    } catch (err) {
      console.log("Profile fetch error:", err);
      setLoading(false);
    }
  };

    //  3. FETCH HISTORY (dummy now, API later)
  const fetchHistory = async () => {
    try {
      // ⭐ Replace with your real API later
      // const res = await fetch("https://your-api.com/history");
      // const data = await res.json();

      const data = DUMMY_HISTORY; // ← TEMP
      setHistory(data);
    } catch (err) {
      console.log("History fetch error:", err);
    }
  };


    //  Expand/Collapse history item

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      {/* ---------------- PROFILE TOP ---------------- */}
      <View style={styles.topSection}>
        <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- DETAILS CARD ---------------- */}
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

        {/* HISTORY DROPDOWN BUTTON */}
        <TouchableOpacity style={styles.row} onPress={() => setShowHistory(!showHistory)}>
          <Text style={styles.label}>View History</Text>
          <Text style={styles.arrow}>{showHistory ? "▲" : "▶"}</Text>
        </TouchableOpacity>

        {/* ---------------- HISTORY LIST ---------------- */}
        {showHistory && (
  <View style={{ marginTop: 12 }}>
    {history.map((item) => (
      <View key={item.id} style={styles.historyContainer}>
        
        {/* HISTORY TITLE ROW */}
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          style={styles.historyRow}
        >
          <Text style={styles.historyTitle}>• {item.title}</Text>
          <Text style={styles.dropdownIcon}>
            {expandedId === item.id ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {/* EXPANDED RESULT BOX */}
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

            {item.inputs.gasPNG > 0 && (
              <ResultRow
                label="Piped Gas"
                value={item.inputs.gasPNG}
                unit="SCM"
                impact={item.results.val_gas}
              />
            )}

            <Text style={styles.totalLine}>
              Gross Total: {item.results.gross} kg
            </Text>

            {/* SOLAR */}
            {item.inputs.solarKwp > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Solar Savings</Text>
                <ResultRow
                  label="Solar Capacity"
                  value={item.inputs.solarKwp}
                  unit="kWp"
                  impact={-item.results.solarOffset}
                />
                <Text>Offset: -{item.results.solarOffset} kg</Text>
              </View>
            )}

            {/* TREES */}
            {item.inputs.trees > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Nature Savings</Text>
                <ResultRow
                  label="Trees Planted"
                  value={item.inputs.trees}
                  unit="Nos"
                  impact={-item.results.treeOffset}
                />
                <Text>Offset: -{item.results.treeOffset} kg</Text>
              </View>
            )}
          </View>
        )}
      </View>
    ))}
  </View>
)}

      </View>

      {/* ---------------- LOGOUT ---------------- */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;





  //  STYLES


const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  topSection: { alignItems: "center", marginBottom: 20 },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  name: { fontSize: 22, fontWeight: "700", marginTop: 10 },
  email: { fontSize: 14, color: "#777", marginBottom: 10 },

  editButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  editButtonText: { color: "white", fontSize: 14, fontWeight: "600" },

  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  label: { fontSize: 16, color: "#444" },
  value: { fontSize: 16, color: "#222", fontWeight: "600" },
  arrow: { fontSize: 18, color: "#888" },
  divider: { height: 1, backgroundColor: "#eee" },


  historyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  historyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  dropdownIcon: {
    fontSize: 18,
    color: "#555",
  },

  expandedBox: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  resultLabel: { fontWeight: "600", color: "#333" },
  resultValue: { opacity: 0.8, color: "#333" },

  totalLine: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },


  logoutButton: {
    width: "90%",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  logoutText: { color: "red", fontSize: 16, fontWeight: "600" },
});
