import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

// Import components
import { LogOut } from "../components/log_out_component"; 
import { Dashboard } from "../components/dashboard_component"; 

export default function IndkøbsansvarligScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={[globalStyles.container, { padding: 20 }]}>
      <Text style={[globalStyles.welcomeText, { marginBottom: 20 }]}>
        Welcome to WASHMATE, {displayName}!
      </Text>
  
      <Dashboard />
  
      <TouchableOpacity
        style={[globalStyles.touchable, { marginTop: 20 }]}
        onPress={() => LogOut(navigation)}
      >
        <Text style={globalStyles.touchableText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
