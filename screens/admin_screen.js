import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

// Import components
import RegistrationComponent from "../components/scan_registration_component";
import { LogOut } from "../components/log_out_component";

export default function AdminScreen() {
  const navigation = useNavigation();
  const [auth, setAuth] = useState(null);
  const [displayName, setDisplayName] = useState("");

  // get user from auth DB
  useEffect(() => {
    const auth = getAuth();
    setAuth(auth);
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);

  return (
    <View style={[globalStyles.container, { padding: 20 }]}>
      <Text style={[globalStyles.welcomeText, { marginBottom: 20 }]}>
        Welcome to WASHMATE, {displayName}!
      </Text>

      <RegistrationComponent />
      <TouchableOpacity
        style={[globalStyles.touchable, { marginTop: 20 }]}
        onPress={() => LogOut(navigation)}
      >
        <Text style={globalStyles.touchableText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
