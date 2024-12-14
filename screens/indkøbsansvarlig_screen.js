import React, { useState, useEffect } from "react";
import { Text, ScrollView } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

// Import components
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
    <ScrollView contentContainerStyle={[globalStyles.container]}>
      <Text style={[globalStyles.welcomeText]}>
         Welcome to <Text style={{ color: "rgb(132, 189, 57)" }}>WASH</Text><Text style={{ color: "#000" }}>MATE</Text>, {displayName}!
      </Text>
      <Dashboard/>
    </ScrollView>
  );
}
