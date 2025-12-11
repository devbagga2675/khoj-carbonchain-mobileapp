import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'

const PROFILE_API = 'https://your-api.com/user/profile'
const HISTORY_API = 'https://your-api.com/user/history'

const Profile = () => {
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderColor: 'black',
    borderWidth: 1


  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  historyBox: {
    marginTop: 15,
    width: '85%',
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  historyText: {
    fontSize: 14,
    marginVertical: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


  const [profile, setProfile] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const profileRes = await fetch(PROFILE_API)
      const profileData = await profileRes.json()

      setProfile(profileData)
      setLoading(false)
    } catch (error) {
      console.error('Profile fetch error:', error)
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const historyRes = await fetch(HISTORY_API)
      const historyData = await historyRes.json()

      setHistory(historyData)
    } catch (error) {
      console.error('History fetch error:', error)
    }
  }

  const handleHistoryToggle = async () => {
    setShowHistory(!showHistory)

    if (!showHistory && history.length === 0) {
      fetchHistory()
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: profile?.profileImage }}
        style={styles.avatar}
      />

      {/* Profile Details */}
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.text}>Email: {profile?.email}</Text>
      <Text style={styles.text}>Phone: {profile?.phone}</Text>
      <Text style={styles.text}>Country: {profile?.country}</Text>

      {/* Dropdown */}
      <TouchableOpacity style={styles.button} onPress={handleHistoryToggle}>
        <Text style={styles.buttonText}>
          {showHistory ? 'Hide History' : 'View History'}
        </Text>
      </TouchableOpacity>

      {/* History */}
      {showHistory && (
        <View style={styles.historyBox}>
          {history.length === 0 ? (
            <Text>No history found</Text>
          ) : (
            history.map((item, index) => (
              <Text key={index} style={styles.historyText}>
                • {item.title}
              </Text>
            ))
          )}
        </View>
      )}
    </View>
  )
}

export default Profile
